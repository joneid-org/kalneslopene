import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import type { Pin } from "@/data/loypekartData.ts";
import { cn } from "@/lib/utils.ts";

type Props = {
  pins: Pin[];
  index: number;
  imageUrl?: string;
  fileName?: string;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
  onPhotoClick: () => void;
  onReplacePhoto?: (fileName: string, file: File) => Promise<void> | void;
};

export function RoutePhotoGallery({
  pins,
  index,
  imageUrl,
  fileName,
  onPrev,
  onNext,
  onSelect,
  onPhotoClick,
  onReplacePhoto,
}: Props) {
  const pin = pins[index];
  const total = pins.length;
  const blurb = pin.photos?.[0]?.description ?? pin.description;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-lg font-extrabold tracking-tight sm:text-[22px]">
          Løypa 200 for 200
        </h2>
        <span className="shrink-0 text-xs font-bold tabular-nums text-muted-foreground sm:text-sm">
          {index + 1} / {total}
        </span>
      </div>
      <p className="mt-1 hidden text-sm text-muted-foreground sm:block">
        Naviger gjennom bildene for å se navngitte steder langs ruten.
      </p>

      <div className="mt-3 grid overflow-hidden rounded-2xl border bg-card shadow-sm sm:mt-4 md:grid-cols-[1fr_1.1fr]">
        <div className="relative order-first min-h-[150px] bg-muted md:order-last md:min-h-[300px]">
          {imageUrl ? (
            <button
              type="button"
              onClick={onPhotoClick}
              className="group absolute inset-0 block cursor-zoom-in"
              aria-label="Åpne bilde i fullskjerm"
            >
              <img
                src={imageUrl}
                alt={pin.label}
                className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 hidden items-center justify-center bg-black/0 transition-colors duration-300 group-hover:bg-black/10 sm:flex">
                <span className="rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  Klikk for å forstørre
                </span>
              </div>
            </button>
          ) : (
            <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
              Bilde kommer
            </div>
          )}
          <span className="absolute left-2.5 top-2.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide text-brand-foreground md:hidden">
            Stopp {index + 1}
          </span>
          {onReplacePhoto && fileName && (
            <ReplacePhotoButton
              fileName={fileName}
              onReplace={onReplacePhoto}
              className="absolute right-2.5 top-2.5 z-10"
            />
          )}
        </div>

        <div className="flex flex-col justify-center p-4 md:p-7">
          <div className="hidden font-display text-[13px] font-bold tabular-nums text-brand-soft-foreground md:block">
            Stopp {index + 1}
          </div>
          <h3 className="font-display text-lg font-extrabold tracking-tight md:mt-1.5 md:text-2xl">
            {pin.label}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:mt-2.5 md:text-[15px]">
            {blurb}
          </p>

          <div className="mt-3 flex gap-2 md:mt-5 md:gap-2.5">
            <button
              type="button"
              onClick={onPrev}
              aria-label="Forrige sted"
              className="flex h-[42px] flex-1 items-center justify-center rounded-xl border bg-card text-muted-foreground transition-colors hover:bg-accent md:size-[46px] md:flex-none"
            >
              <ChevronLeft className="size-[18px]" />
            </button>
            <button
              type="button"
              onClick={onNext}
              aria-label="Neste sted"
              className="flex h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-primary-foreground transition-colors hover:bg-primary/90 md:h-[46px] md:flex-none md:px-5"
            >
              <span className="hidden md:inline">Neste sted</span>
              <ChevronRight className="size-[18px]" />
            </button>
          </div>

          <div className="mt-5 hidden gap-1.5 md:flex">
            {pins.map((stop, i) => (
              <button
                key={stop.id}
                type="button"
                onClick={() => onSelect(i)}
                aria-label={`Gå til stopp ${i + 1}`}
                className={cn(
                  "h-[5px] rounded-full transition-all",
                  i === index
                    ? "w-6 bg-primary"
                    : "w-[5px] bg-border hover:bg-muted-foreground/50",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
