import { useMutation } from "@tanstack/react-query";
import { ImageDown } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MUTATIONS, type ThumbnailUpload } from "@/api/mutations.ts";
import { IMMUTABLE_CACHE_CONTROL, uploadToS3 } from "@/api/s3.ts";
import { LoadingButton } from "@/components/LoadingButton.tsx";
import { convertImageToWebp, THUMBNAIL_DIMENSION } from "@/lib/photoUtils.ts";

type ThumbnailBackfillButtonProps = {
  raceUuid: string;
  missingCount: number;
  onDone: () => void;
};

async function uploadThumbnail({ photo, uploadUrl }: ThumbnailUpload) {
  // Bypass the HTTP cache: a copy cached from a plain <img> load lacks CORS headers.
  const response = await fetch(photo.url, { cache: "no-store" });
  if (!response.ok) throw new Error(`Download failed: ${response.status}`);
  const name = photo.url.substring(photo.url.lastIndexOf("/") + 1);
  const thumbnail = await convertImageToWebp(
    new File([await response.blob()], name),
    { maxDimension: THUMBNAIL_DIMENSION },
  );
  await uploadToS3(thumbnail, uploadUrl, undefined, IMMUTABLE_CACHE_CONTROL);
}

export function ThumbnailBackfillButton({
  raceUuid,
  missingCount,
  onDone,
}: ThumbnailBackfillButtonProps) {
  const [progress, setProgress] = useState<{ done: number; total: number }>();

  const mutation = useMutation({
    mutationFn: async () => {
      const uploads = await MUTATIONS.race.requestThumbnailUploads(raceUuid);
      let failed = 0;
      for (const [index, upload] of uploads.entries()) {
        setProgress({ done: index, total: uploads.length });
        try {
          await uploadThumbnail(upload);
        } catch {
          failed++;
        }
      }
      return { created: uploads.length - failed, failed };
    },
    onSuccess: ({ created, failed }) => {
      if (failed > 0) {
        toast.warning(
          `Laget ${created} miniatyrbilder, ${failed} feilet. Prøv igjen senere.`,
        );
      } else {
        toast.success(`Laget ${created} miniatyrbilder`);
      }
      onDone();
    },
    onSettled: () => setProgress(undefined),
  });

  return (
    <LoadingButton
      variant="outline"
      size="sm"
      loading={mutation.isPending}
      icon={<ImageDown className="size-4" />}
      onClick={() => mutation.mutate()}
    >
      {progress
        ? `Lager miniatyrbilder (${progress.done}/${progress.total})…`
        : `Lag miniatyrbilder (${missingCount})`}
    </LoadingButton>
  );
}
