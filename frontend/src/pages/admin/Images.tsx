import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { kyClient, queryClient } from "@/api/queryClient.ts";
import { AdminPhotoGrid } from "@/components/admin/AdminPhotoGrid.tsx";
import { UploadDropzone } from "@/components/Pictures/UploadDropzone.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { extractYear, formatDDMonth } from "@/lib/timeUtils.ts";

import type { S3FileDto } from "@/model/DTO.ts";

export interface UploadItem {
  id: string;
  name: string;
  previewUrl: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

const NOW = new Date();

export function requestPresignedUrls(raceUuid: string, fileNames: string[]) {
  return kyClient
    .post(`/api/races/${raceUuid}/photos`, {
      json: fileNames,
    })
    .json<{ [key in string]: { uploadUrl: string; s3File: S3FileDto } }>();
}

export function confirmUploadedFile(fileUuid: string) {
  return kyClient
    .patch(`/api/s3/files/${fileUuid}/confirm-upload`)
    .json<S3FileDto>();
}

export function deleteS3Files(fileUuids: string[]) {
  return kyClient.delete("/api/s3/files", { json: fileUuids }).json<void>();
}

export function ImagesPage() {
  const { data, isLoading } = useQuery(QUERIES.race.getAllRaces({ to: NOW }));
  const races = data ?? [];

  const [uploads, setUploads] = useState<Record<string, UploadItem[]>>({});

  const updateUpload = (
    raceUuid: string,
    id: string,
    patch: Partial<UploadItem>,
  ) => {
    setUploads((prev) => ({
      ...prev,
      [raceUuid]: (prev[raceUuid] ?? []).map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  };

  const removeUpload = (raceUuid: string, id: string) => {
    setUploads((prev) => {
      const list = prev[raceUuid] ?? [];
      const target = list.find((item) => item.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return {
        ...prev,
        [raceUuid]: list.filter((item) => item.id !== id),
      };
    });
  };

  const uploadToS3 = (
    file: File,
    url: string,
    onProgress: (percent: number) => void,
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        const percent = Math.round((event.loaded / event.total) * 100);
        onProgress(percent);
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Upload failed"));
      xhr.send(file);
    });
  };

  const startUpload = async (
    raceUuid: string,
    file: File,
    uploadUrl: string,
    s3FileDto: S3FileDto,
  ) => {
    const id = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(file);

    setUploads((prev) => ({
      ...prev,
      [raceUuid]: [
        ...(prev[raceUuid] ?? []),
        {
          id,
          name: file.name,
          previewUrl,
          progress: 0,
          status: "uploading",
        },
      ],
    }));

    try {
      await uploadToS3(file, uploadUrl, (progress) => {
        updateUpload(raceUuid, id, { progress });
      });

      await confirmUploadedFile(s3FileDto.uuid);
      await queryClient.invalidateQueries({ queryKey: ["race", "getAll"] });
      removeUpload(raceUuid, id);
    } catch (error) {
      updateUpload(raceUuid, id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const handleFilesSelected = async (raceUuid: string, fileList: FileList) => {
    const files = Array.from(fileList);
    const urlMap = await requestPresignedUrls(
      raceUuid,
      files.map((file) => file.name),
    );
    files.forEach((file) => {
      const { uploadUrl, s3File } = urlMap[file.name];
      void startUpload(raceUuid, file, uploadUrl, s3File);
    });
  };

  return (
    <div className="page-content max-w-3xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Bilder</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last opp og slett bilder for fullførte løp.
        </p>
      </header>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laster...</p>
      ) : races.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Ingen fullførte løp ennå.
        </p>
      ) : (
        <Accordion type="single" collapsible className="w-full">
          {races.map((race) => {
            return (
              <AccordionItem key={race.uuid} value={race.uuid}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">
                      {formatDDMonth(race.raceDate)}{" "}
                      {extractYear(race.raceDate)}
                    </span>
                    <Badge variant="secondary">
                      {race.photos.length} bilder
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <UploadDropzone
                    onFilesSelected={(files) =>
                      handleFilesSelected(race.uuid, files)
                    }
                  />
                  <AdminPhotoGrid
                    photos={race.photos}
                    uploads={uploads[race.uuid] ?? []}
                    onBulkDelete={async (ids) => {
                      await deleteS3Files(ids);
                      await queryClient.invalidateQueries({
                        queryKey: ["race", "getAll"],
                      });
                    }}
                    onDismissUpload={(uploadId) =>
                      removeUpload(race.uuid, uploadId)
                    }
                  />
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}
    </div>
  );
}
