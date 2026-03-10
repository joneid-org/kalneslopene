import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import type { Photo } from "../data/mockdata.ts";

type PhotoDialogProps = {
  photos: Photo[];
  index: number | null;
  onIndexChange: (idx: number | null) => void;
};

export default function PhotoDialog({
  photos,
  index,
  onIndexChange,
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

  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] lg:max-w-[75vw] p-2 sm:p-4 bg-white border-0">
        <DialogTitle className="sr-only">
          Bilde {(index ?? 0) + 1} av {photos.length}
        </DialogTitle>
        {index !== null && (
          <div className="relative">
            <img
              src={photos[index].url}
              alt={photos[index].caption}
              className="w-full rounded-md object-contain max-h-[88vh]"
            />
            {photos[index].caption && (
              <p className="text-center text-xs text-black/70 mt-2">
                {photos[index].caption}
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
