import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog.tsx";
import type { RouteSection } from "@/data/200m200mData.ts";

const lightboxNavClass =
  "absolute top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white";
type Props = {
  routeDetails: RouteSection[];
  onReplacePhoto?: (fileName: string, file: File) => Promise<void> | void;
};

export function RouteDetails({ routeDetails, onReplacePhoto }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // biome-ignore lint/style/noNonNullAssertion: reason
  // biome-ignore lint/suspicious/noExtraNonNullAssertion: reason
  const photo = routeDetails[photoIndex]!!.photo;
  const total = routeDetails.length;
  const prev = () => setPhotoIndex((i) => (i - 1 + total) % total);
  const next = () => setPhotoIndex((i) => (i + 1) % total);

  return (
    <>
      <div className="space-y-3">
        <h1 className=" font-semibold tracking-tight">Løypa 200m for 200m</h1>
        <p className="text-sm text-muted-foreground">
          Naviger gjennom bildene for å se steder langs ruten.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-6 md:min-h-80">
          <div className="flex-1 space-y-3 flex flex-col justify-between">
            <div>
              <h2 className="mt-3 font-semibold tracking-tight">
                {routeDetails[photoIndex].title}
              </h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">
                {routeDetails[photoIndex].description}
              </p>
            </div>
          </div>
          <div className="flex-1">
            <div className="relative h-full">
              <button
                type="button"
                className="w-full h-full group relative overflow-hidden rounded-xl border shadow-sm aspect-video md:aspect-auto bg-muted block cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
                aria-label="Åpne bilde i fullskjerm"
              >
                <img
                  key={photo.fileName}
                  src={photo.fileName}
                  alt={photo.description}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                    Klikk for å forstørre
                  </span>
                </div>
              </button>
              {onReplacePhoto && photo.fileName && (
                <ReplacePhotoButton
                  fileName={photo.fileName}
                  onReplace={onReplacePhoto}
                  className="absolute top-2 right-2 z-10"
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            aria-label="Forrige bilde"
          >
            <ChevronLeftIcon className="size-4" />
          </Button>
          <span className="text-sm font-semibold text-muted-foreground tabular-nums min-w-12 text-center">
            {photoIndex + 1} / {total}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            aria-label="Neste bilde"
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>
      </div>

      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/90" />
          <DialogContent className="max-w-none w-screen h-screen p-0 border-0 bg-transparent shadow-none flex items-center justify-center [&>button]:hidden">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
                aria-label="Lukk"
              >
                <XIcon className="size-5" />
              </Button>
            </DialogClose>
            {onReplacePhoto && photo.fileName && (
              <ReplacePhotoButton
                fileName={photo.fileName}
                onReplace={onReplacePhoto}
                className="absolute top-4 left-4 z-50"
              />
            )}
            <Button
              variant="ghost"
              size="icon"
              className={`absolute left-4 ${lightboxNavClass}`}
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Forrige bilde"
            >
              <ChevronLeftIcon className="size-6" />
            </Button>
            <div className="flex flex-col items-center gap-4 px-16 max-w-5xl w-full">
              <img
                key={photo.fileName}
                src={photo.fileName}
                alt={photo.description}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <div className="text-center space-y-1">
                <p className="text-white font-semibold text-lg">
                  {photo.fileName}
                </p>
                <p className="text-white/70 text-sm max-w-xl">
                  {photo.description}
                </p>
                <p className="text-white/40 text-xs tabular-nums">
                  {photoIndex + 1} / {total}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className={`absolute right-4 ${lightboxNavClass}`}
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Neste bilde"
            >
              <ChevronRightIcon className="size-6" />
            </Button>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
}
