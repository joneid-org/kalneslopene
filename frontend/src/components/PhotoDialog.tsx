import { ChevronLeft, ChevronRight } from "lucide-react";
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
  return (
    <Dialog
      open={index !== null}
      onOpenChange={(open) => !open && onIndexChange(null)}
    >
      <DialogContent className="max-w-screen-sm p-2 sm:p-4 bg-black border-0">
        <DialogTitle className="sr-only">
          Bilde {(index ?? 0) + 1} av {photos.length}
        </DialogTitle>
        {index !== null && (
          <div className="relative">
            <img
              src={photos[index].url}
              alt={photos[index].caption}
              className="w-full rounded-md object-contain max-h-[80vh]"
            />
            {photos[index].caption && (
              <p className="text-center text-xs text-white/70 mt-2">
                {photos[index].caption}
              </p>
            )}
            <div className="absolute inset-y-0 left-0 flex items-center">
              <button
                type="button"
                className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                disabled={index === 0}
                onClick={() => onIndexChange(index - 1)}
              >
                <ChevronLeft className="size-7" />
              </button>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center">
              <button
                type="button"
                className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                disabled={index === photos.length - 1}
                onClick={() => onIndexChange(index + 1)}
              >
                <ChevronRight className="size-7" />
              </button>
            </div>
            <p className="absolute bottom-6 inset-x-0 text-center text-xs text-white/50">
              {index + 1} / {photos.length}
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
