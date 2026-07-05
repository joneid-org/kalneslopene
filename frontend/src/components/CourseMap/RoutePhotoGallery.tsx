import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import { routeDetails } from "@/data/200m200mData.ts";
import { useStaticPhotos } from "@/hooks/useStaticPhotos.tsx";
import { cn } from "@/lib/utils.ts";

export function RoutePhotoGallery() {
  const { resolvePhotoUrl, handleReplacePhoto } = useStaticPhotos();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const routeSection = routeDetails[currentIndex];
  const total = routeDetails.length;
  const photo = routeSection.photo;
  const photoUrl = resolvePhotoUrl(photo.fileName, photo.fallback);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const goNext = () => setCurrentIndex((i) => (i + 1) % total);

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold tracking-tight sm:text-[22px]">
          Løypa 200 for 200
        </h2>
        <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground sm:text-sm">
          {currentIndex + 1} / {total}
        </span>
      </div>
      <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
        Naviger gjennom bildene for å se navngitte steder langs ruten.
      </p>

      <div className="mt-3 grid overflow-hidden rounded-2xl border bg-card shadow-sm sm:mt-4 md:grid-cols-[1fr_1.1fr]">
        <div className="relative order-first min-h-[150px] bg-muted md:order-last md:min-h-[300px]">
          <button
            type="button"
            className="group absolute inset-0 block cursor-zoom-in"
            aria-label="Åpne bilde i fullskjerm"
            onClick={() => setLightboxIndex(0)}
          >
            <img
              src={photoUrl}
              alt={routeSection.photo.description ?? routeSection.title}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 hidden items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10 sm:flex">
              <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                Klikk for å forstørre
              </span>
            </div>
          </button>
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-foreground md:hidden">
            Stopp {currentIndex + 1}
          </span>
          {handleReplacePhoto && photo.fileName && (
            <ReplacePhotoButton
              fileName={photo.fileName}
              onReplace={handleReplacePhoto}
              className="absolute right-2.5 top-2.5 z-10"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-4 md:p-7">
          <div className="hidden font-display text-[13px] font-bold tabular-nums text-brand-soft-foreground md:block">
            Stopp {currentIndex + 1}
          </div>
          <h3 className="font-display text-lg font-extrabold tracking-tight md:mt-1.5 md:text-2xl">
            {routeSection.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-2.5 md:text-[15px]">
            {routeSection.description}
          </p>

          <div className="mt-3 flex gap-2 md:mt-5 md:gap-2.5">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Forrige sted"
              className="flex h-[42px] flex-1 items-center justify-center rounded-xl border bg-card text-muted-foreground transition-colors hover:bg-accent md:size-[46px] md:flex-none"
            >
              <ChevronLeft className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="Neste sted"
              className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:h-[46px] md:flex-none md:px-5"
            >
              <span className="hidden md:inline">Neste sted</span>
              <ChevronRight className="size-[18px]" />
            </button>
          </div>

          <div className="mt-5 hidden gap-1.5 md:flex">
            {routeDetails.map((stop, i) => (
              <button
                key={stop.title}
                type="button"
                onClick={() => setCurrentIndex(i)}
                aria-label={`Gå til stopp ${i + 1}`}
                className={cn(
                  "h-[5px] rounded-full transition-all",
                  i === currentIndex
                    ? "w-6 bg-primary"
                    : "w-[5px] bg-border hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <PhotoDialog
        photos={[
          {
            url: photoUrl,
            description: photo.description,
            fileName: photo.fileName,
          },
        ]}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onReplacePhoto={handleReplacePhoto}
      />
    </section>
  );
}
