import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { queryClient } from "@/api/queryClient.ts";
import { IMMUTABLE_CACHE_CONTROL, uploadToS3 } from "@/api/s3.ts";
import { AdminPhotoGrid } from "@/components/admin/AdminPhotoGrid.tsx";
import { PhotographerField } from "@/components/admin/PhotographerField.tsx";
import { UploadDropzone } from "@/components/Pictures/UploadDropzone.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { convertImageToWebp, UnsupportedImageError } from "@/lib/photoUtils.ts";
import {
  extractYear,
  formatDayMonth,
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
    } catch (error) {
      updateUpload(raceUuid, id, {
        status: "error",
        error: error instanceof Error ? error.message : "Upload failed",
      });
    }
  };

  const uploadMutation = useMutation({
    mutationFn: async ({
      raceUuid,
      fileList,
    }: {
      raceUuid: string;
      fileList: FileList;
    }) => {
      const results = await Promise.allSettled(
        Array.from(fileList).map((file) => convertImageToWebp(file)),
      );
      const files: File[] = [];
      const skipped: UnsupportedImageError[] = [];
      for (const result of results) {
        if (result.status === "fulfilled") files.push(result.value);
        else if (result.reason instanceof UnsupportedImageError)
          skipped.push(result.reason);
        else throw result.reason;
      }
      if (files.length === 0 && skipped.length > 0) throw skipped[0];
      if (skipped.length > 0) {
        toast.warning(
          `Hoppet over ${skipped.length} bilde(r) som ikke kunne leses: ${skipped.map((error) => error.fileName).join(", ")}`,
        );
      }
      const urlMap = await MUTATIONS.race.requestPhotoUploads(
        raceUuid,
        files.map((file) => file.name),
      );
      await Promise.all(
        files.map((file) => {
          const { uploadUrl, s3File } = urlMap[file.name];
          return startUpload(raceUuid, file, uploadUrl, s3File);
        }),
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: query.queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: (fileUuids: string[]) => MUTATIONS.s3.deleteFiles(fileUuids),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: query.queryKey }),
  });

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
                      {formatDayMonth(race.raceDate)}{" "}
                      {extractYear(race.raceDate)}
                    </span>
                    <Badge variant="secondary">
                      {race.photos.length} bilder
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-3">
                  <PhotographerField
                    raceUuid={race.uuid}
                    photographer={race.photographer}
                    onSaved={() =>
                      queryClient.invalidateQueries({
                        queryKey: query.queryKey,
                      })
                    }
                  />
                  <UploadDropzone
                    onFilesSelected={(fileList) =>
                      uploadMutation.mutate({ raceUuid: race.uuid, fileList })
                    }
                  />
                  <AdminPhotoGrid
                    photos={race.photos}
                    uploads={uploads[race.uuid] ?? []}
                    onBulkDelete={(ids) => deleteMutation.mutateAsync(ids)}
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
