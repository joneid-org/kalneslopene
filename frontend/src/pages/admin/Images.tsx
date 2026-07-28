import { type InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { queryClient } from "@/api/queryClient.ts";
import { IMMUTABLE_CACHE_CONTROL, uploadToS3 } from "@/api/s3.ts";
import { AdminPhotoGrid } from "@/components/admin/AdminPhotoGrid.tsx";
import { UploadDropzone } from "@/components/Pictures/UploadDropzone.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  confirmUploadedFiles,
  deleteS3Files,
  requestPresignedUrls,
} from "@/lib/fileUploadUtils.ts";
import { convertImageToWebp } from "@/lib/photoUtils.ts";
import {
  extractYear,
  formatDDMonth,
  toLocalDateTimeString,
} from "@/lib/timeUtils.ts";
import type { PagedResponse, RaceDTO, S3FileDto } from "@/model/DTO.ts";

const NOW = toLocalDateTimeString(new Date());

export interface UploadItem {
  id: string;
  name: string;
  previewUrl: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export function ImagesPage() {
  const query = QUERIES.race.getRacesInfinite({ filter: { to: NOW } });
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useInfiniteQuery(query);
  const races = data?.pages.flatMap((page) => page.content) ?? [];

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

  const addPhotoToCache = (raceUuid: string, photo: S3FileDto) => {
    queryClient.setQueryData<InfiniteData<PagedResponse<RaceDTO>>>(
      query.queryKey,
      (data) =>
        data && {
          ...data,
          pages: data.pages.map((page) => ({
            ...page,
            content: page.content.map((race) =>
              race.uuid === raceUuid
                ? { ...race, photos: [...race.photos, photo] }
                : race,
            ),
          })),
        },
    );
  };

  const startUpload = async (
    raceUuid: string,
    file: File,
    uploadUrl: string,
    s3FileDto: S3FileDto,
  ): Promise<string | null> => {
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
      await uploadToS3(
        file,
        uploadUrl,
        (progress) => {
          updateUpload(raceUuid, id, { progress });
        },
        IMMUTABLE_CACHE_CONTROL,
      );
      addPhotoToCache(raceUuid, s3FileDto);
      removeUpload(raceUuid, id);
      return s3FileDto.uuid;
    } catch (error) {
      updateUpload(raceUuid, id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
      return null;
    }
  };

  const handleFilesSelected = async (raceUuid: string, fileList: FileList) => {
    const files = await Promise.all(
      Array.from(fileList).map((file) => convertImageToWebp(file)),
    );
    const urlMap = await requestPresignedUrls(
      raceUuid,
      files.map((file) => file.name),
    );
    const results = await Promise.all(
      files.map((file) => {
        const { uploadUrl, s3File } = urlMap[file.name];
        return startUpload(raceUuid, file, uploadUrl, s3File);
      }),
    );

    const uploadedUuids = results.filter((uuid) => uuid !== null);
    if (uploadedUuids.length === 0) return;

    await confirmUploadedFiles(uploadedUuids);
    await queryClient.invalidateQueries({ queryKey: query.queryKey });
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
                        queryKey: query.queryKey,
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

      {hasNextPage && (
        <Button
          variant="outline"
          className="w-full"
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? "Laster …" : "Vis flere løp"}
        </Button>
      )}
    </div>
  );
}
