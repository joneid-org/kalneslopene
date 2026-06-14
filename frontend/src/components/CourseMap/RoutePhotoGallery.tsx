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
import type { StaticS3File } from "@/data/loypekartData.ts";
import type { S3FileDto } from "@/model/DTO.ts";

const lightboxNavClass =
  "absolute top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white";

type GalleryPhoto = (S3FileDto | StaticS3File) & { label: string };

type Props = {
  photos: GalleryPhoto[];
  onReplacePhoto?: (fileName: string, file: File) => Promise<void> | void;
};

export function RoutePhotoGallery({ photos, onReplacePhoto }: Props) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photo = photos[photoIndex];
  const currentFileName = "fileName" in photo ? photo.fileName : undefined;
  const total = photos.length;
  const prev = () => setPhotoIndex((i) => (i - 1 + total) % total);
  const next = () => setPhotoIndex((i) => (i + 1) % total);

  return (
    <>
      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Løypa 200 for 200
        </h2>
        <p className="text-sm text-muted-foreground">
          Naviger gjennom bildene for å se steder langs ruten.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground tabular-nums">
                {photoIndex + 1} / {total}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">
              {photo.label}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {photo.description}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Forrige bilde"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <div className="flex gap-1.5">
              {photos.map((p, i) => (
                <button
                  key={p.url}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Gå til bilde ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === photoIndex
                      ? "w-4 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
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

        <div className="md:w-1/2 shrink-0">
          <div className="relative">
            <button
              type="button"
              className="w-full group relative overflow-hidden rounded-xl border shadow-sm aspect-video bg-muted block cursor-zoom-in"
              onClick={() => setLightboxOpen(true)}
              aria-label="Åpne bilde i fullskjerm"
            >
              <img
                key={photo.url}
                src={photo.url}
                alt={photo.label}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  Klikk for å forstørre
                </span>
              </div>
            </button>
            {onReplacePhoto && currentFileName && (
              <ReplacePhotoButton
                fileName={currentFileName}
                onReplace={onReplacePhoto}
                className="absolute top-2 right-2 z-10"
              />
            )}
          </div>
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
            {onReplacePhoto && currentFileName && (
              <ReplacePhotoButton
                fileName={currentFileName}
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
                key={photo.url}
                src={photo.url}
                alt={photo.label}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <div className="text-center space-y-1">
                <p className="text-white font-semibold text-lg">
                  {photo.label}
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
