import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import type { StaticS3File } from "@/data/loypekartData.ts";
import type { S3FileDto } from "@/model/DTO.ts";

type PhotoDialogProps = {
  photos: (S3FileDto | StaticS3File)[];
  index: number | null;
  onIndexChange: (idx: number | null) => void;
  onReplacePhoto?: (fileName: string, file: File) => Promise<void> | void;
};

export default function PhotoDialog({
  photos,
  index,
  onIndexChange,
  onReplacePhoto,
}: PhotoDialogProps) {
  useEffect(() => {
    if (index === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && index > 0) onIndexChange(index - 1);
      else if (e.key === "ArrowRight" && index < photos.length - 1)
        onIndexChange(index + 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, photos.length, onIndexChange]);

  const current = index !== null ? photos[index] : undefined;
  const currentFileName =
    current && "fileName" in current ? current.fileName : undefined;

  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogContent
        className="p-2 sm:p-4 bg-white border-0"
        style={{ maxWidth: "var(--page-max-width)", width: "95vw" }}
      >
        <DialogTitle className="sr-only">
          Bilde {(index ?? 0) + 1} av {photos.length}
        </DialogTitle>
        {index !== null && (
          <div className="relative">
            <img
              src={photos[index].url}
              alt={photos[index].description}
              className="w-full rounded-md object-contain max-h-[88vh]"
            />
            {onReplacePhoto && currentFileName && (
              <ReplacePhotoButton
                fileName={currentFileName}
                onReplace={onReplacePhoto}
                className="absolute top-2 left-2 z-10"
              />
            )}
            {photos[index].description && (
              <p className="text-center text-xs text-black/70 mt-2">
                {photos[index].description}
              </p>
            )}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                className="p-1 text-black/70 hover:text-black disabled:opacity-20"
                disabled={index === 0}
                onClick={() => onIndexChange(index - 1)}
              >
                <ChevronLeft className="size-7" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                className="p-1 text-black/70 hover:text-black disabled:opacity-20"
                disabled={index === photos.length - 1}
                onClick={() => onIndexChange(index + 1)}
              >
                <ChevronRight className="size-7" />
              </button>
            </div>
            <p className="absolute bottom-6 inset-x-0 text-center text-xs text-black/70">
              {index + 1} / {photos.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
