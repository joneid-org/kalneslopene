import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
} from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MUTATIONS, type RacePhotoUpload } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { queryClient } from "@/api/queryClient.ts";
import { IMMUTABLE_CACHE_CONTROL, uploadToS3 } from "@/api/s3.ts";
import { AdminPhotoGrid } from "@/components/admin/AdminPhotoGrid.tsx";
import { PhotographerField } from "@/components/admin/PhotographerField.tsx";
import { ThumbnailBackfillButton } from "@/components/admin/ThumbnailBackfillButton.tsx";
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
  type ConvertedPhoto,
  convertPhotoWithThumbnail,
  UnsupportedImageError,
} from "@/lib/photoUtils.ts";
import {
  extractYear,
  formatDDMonth,
  toLocalDateTimeString,
} from "@/lib/timeUtils.ts";
import type { PagedResponse, PhotoDTO, RaceDTO } from "@/model/DTO.ts";

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

  const addPhotoToCache = (raceUuid: string, photo: PhotoDTO) => {
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
    { full, thumbnail }: ConvertedPhoto,
    { uploadUrl, thumbnailUploadUrl, photo }: RacePhotoUpload,
  ) => {
    const id = crypto.randomUUID();
    const previewUrl = URL.createObjectURL(thumbnail);

    setUploads((prev) => ({
      ...prev,
      [raceUuid]: [
        ...(prev[raceUuid] ?? []),
        {
          id,
          name: full.name,
          previewUrl,
          progress: 0,
          status: "uploading",
        },
      ],
    }));

    try {
      await uploadToS3(
        full,
        uploadUrl,
        (progress) => {
          updateUpload(raceUuid, id, { progress });
        },
        IMMUTABLE_CACHE_CONTROL,
      );
      // A missing thumbnail is not fatal: it expires server-side and the grid falls back to the full photo.
      const thumbnailUploaded = await uploadToS3(
        thumbnail,
        thumbnailUploadUrl,
        undefined,
        IMMUTABLE_CACHE_CONTROL,
      ).then(
        () => true,
        () => false,
      );
      addPhotoToCache(
        raceUuid,
        thumbnailUploaded ? photo : { ...photo, thumbnailUrl: undefined },
      );
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
        Array.from(fileList).map((file) => convertPhotoWithThumbnail(file)),
      );
      const photos: ConvertedPhoto[] = [];
      const skipped: UnsupportedImageError[] = [];
      for (const result of results) {
        if (result.status === "fulfilled") photos.push(result.value);
        else if (result.reason instanceof UnsupportedImageError)
          skipped.push(result.reason);
        else throw result.reason;
      }
      if (photos.length === 0 && skipped.length > 0) throw skipped[0];
      if (skipped.length > 0) {
        toast.warning(
          `Hoppet over ${skipped.length} bilde(r) som ikke kunne leses: ${skipped.map((error) => error.fileName).join(", ")}`,
        );
      }
      const urlMap = await MUTATIONS.race.requestPhotoUploads(
        raceUuid,
        photos.map((photo) => photo.full.name),
      );
      await Promise.all(
        photos.map((photo) =>
          startUpload(raceUuid, photo, urlMap[photo.full.name]),
        ),
      );
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: query.queryKey }),
  });

  const deleteMutation = useMutation({
    mutationFn: ({
      raceUuid,
      photoUuids,
    }: {
      raceUuid: string;
      photoUuids: string[];
    }) => MUTATIONS.race.deletePhotos(raceUuid, photoUuids),
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
            const missingThumbnails = race.photos.filter(
              (photo) => !photo.thumbnailUrl,
            ).length;
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
                  <PhotographerField
                    raceUuid={race.uuid}
                    photographer={race.photographer}
                    onSaved={() =>
                      queryClient.invalidateQueries({
                        queryKey: query.queryKey,
                      })
                    }
                  />
                  {missingThumbnails > 0 && (
                    <ThumbnailBackfillButton
                      raceUuid={race.uuid}
                      missingCount={missingThumbnails}
                      onDone={() =>
                        queryClient.invalidateQueries({
                          queryKey: query.queryKey,
                        })
                      }
                    />
                  )}
                  <UploadDropzone
                    onFilesSelected={(fileList) =>
                      uploadMutation.mutate({ raceUuid: race.uuid, fileList })
                    }
                  />
                  <AdminPhotoGrid
                    photos={race.photos}
                    uploads={uploads[race.uuid] ?? []}
                    onBulkDelete={(ids) =>
                      deleteMutation.mutateAsync({
                        raceUuid: race.uuid,
                        photoUuids: ids,
                      })
                    }
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
