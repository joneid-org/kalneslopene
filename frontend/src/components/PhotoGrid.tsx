import { Card, CardContent } from "@/components/ui/card.tsx";
import type { Photo } from "@/data/mockdata.ts";

type PhotoGridProps = {
  photos: Photo[];
  onPhotoClick: (idx: number) => void;
};

export default function PhotoGrid({ photos, onPhotoClick }: PhotoGridProps) {
  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">
        Ingen bilder tilgjengelig.
      </p>
    );
  }

  return (
    <Card>
      <CardContent className="py-3 px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {photos.map((photo, idx) => (
            <button
              key={photo.id}
              type="button"
              className="aspect-video sm:aspect-square overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              onClick={() => onPhotoClick(idx)}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
              />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
