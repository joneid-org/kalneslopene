import { Images } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils.ts";
import type { S3FileDto } from "@/model/DTO.ts";

type RacePhotoGridProps = {
  photos: S3FileDto[];
  uuid: string;
  onPhotoClick: (idx: number) => void;
};

const FULL_CELLS = 4;

function PhotoButton({
  photo,
  onClick,
  className,
}: {
  photo: S3FileDto;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <img
        src={photo.url}
        alt={photo.description}
        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </button>
  );
}

export function RacePhotoGrid({
  photos,
  uuid,
  onPhotoClick,
}: RacePhotoGridProps) {
  if (photos.length === 0) return null;

  const galleryPath = `/Bilder/${uuid}`;
  const hasOverflow = photos.length > FULL_CELLS + 1;
  const fullPhotos = hasOverflow ? photos.slice(0, FULL_CELLS) : photos;
  const overflowPhoto = hasOverflow ? photos[FULL_CELLS] : undefined;
  const remaining = photos.length - FULL_CELLS;

  const [first, ...rest] = fullPhotos;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between md:mb-4">
        <h2 className="font-display text-base font-extrabold tracking-tight md:text-lg">
          Bilder fra løpet
        </h2>
        <Link
          to={galleryPath}
          className="inline-flex h-9 items-center gap-2 rounded-[11px] border bg-card px-3 text-[13px] font-semibold text-foreground/80 transition-colors hover:bg-accent"
        >
          <Images className="size-3.5 shrink-0" />
          <span className="hidden sm:inline">
            Se alle {photos.length} bilder
          </span>
          <span className="sm:hidden">Se alle {photos.length}</span>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
        {first && (
          <PhotoButton
            photo={first}
            onClick={() => onPhotoClick(0)}
            className="col-span-2 aspect-[2/1] md:row-span-2 md:aspect-square"
          />
        )}
        {rest.map((photo, idx) => (
          <PhotoButton
            key={photo.uuid}
            photo={photo}
            onClick={() => onPhotoClick(idx + 1)}
            className="aspect-square"
          />
        ))}
        {overflowPhoto && (
          <Link
            to={galleryPath}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-brand-ink"
          >
            <img
              src={overflowPhoto.url}
              alt=""
              className="size-full object-cover opacity-60 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 text-white">
              <span className="font-display text-2xl font-extrabold leading-none tabular-nums">
                +{remaining}
              </span>
              <span className="text-xs font-semibold opacity-85">
                flere bilder
              </span>
            </div>
          </Link>
        )}
      </div>
    </section>
  );
}
