import { MapPin } from "lucide-react";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import type { Pin } from "@/data/loypekartData.ts";

type Props = {
  pin: Pin;
  index: number;
  total: number;
  imageUrl?: string;
  fileName?: string;
  onPhotoClick: () => void;
  onReplacePhoto?: (fileName: string, file: File) => Promise<void> | void;
};

export function PinInfoPanel({
  pin,
  index,
  total,
  imageUrl,
  fileName,
  onPhotoClick,
  onReplacePhoto,
}: Props) {
  const blurb = pin.photos?.[0]?.description ?? pin.description;

  return (
    <div className="flex-col overflow-hidden rounded-2xl border bg-card shadow-sm md:flex">
      <div className="relative h-[170px] shrink-0 overflow-hidden bg-muted">
        {imageUrl ? (
          <button
            type="button"
            onClick={onPhotoClick}
            className="group block size-full cursor-zoom-in"
            aria-label="Åpne bilde i fullskjerm"
          >
            <img
              src={imageUrl}
              alt={pin.label}
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Bilde kommer
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-brand px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-wide text-brand-foreground">
          Stopp {index + 1} av {total}
        </span>
        {onReplacePhoto && fileName && (
          <ReplacePhotoButton
            fileName={fileName}
            onReplace={onReplacePhoto}
            className="absolute right-3 top-3 z-10"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <MapPin className="size-[18px] shrink-0 text-primary" />
          <h2 className="font-display text-xl font-extrabold tracking-tight">
            {pin.label}
          </h2>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {blurb}
        </p>
        {pin.tips && (
          <div className="mt-auto rounded-lg border-l-2 border-primary bg-secondary/60 px-3 py-2">
            <span className="text-[10px] font-bold uppercase tracking-wide text-primary">
              Tips
            </span>
            <p className="mt-0.5 text-sm text-muted-foreground">{pin.tips}</p>
          </div>
        )}
      </div>
    </div>
  );
}
