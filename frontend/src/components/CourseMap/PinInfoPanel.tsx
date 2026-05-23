import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  categoryLabel,
  categoryVariant,
  type Pin,
  type RoutePhoto,
} from "@/data/loypekartData.ts";

type Props = {
  pin: Pin | null;
  onClose: () => void;
  photo?: RoutePhoto;
  onPhotoClick?: () => void;
};

export function PinInfoPanel({ pin, onClose, photo, onPhotoClick }: Props) {
  if (!pin) {
    return (
      <Card className="h-full flex items-center justify-center border-dashed">
        <CardContent className="text-center py-10 space-y-2">
          <p className="text-2xl">📍</p>
          <p className="text-sm text-muted-foreground">
            Klikk på en pin i kartet for å se detaljer om punktet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base leading-snug">{pin.label}</CardTitle>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground mt-0.5"
            aria-label="Lukk"
          >
            <XIcon className="size-4" />
          </button>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <Badge variant={categoryVariant[pin.category]} className="text-xs">
            {categoryLabel[pin.category]}
          </Badge>
          <span className="text-xs text-muted-foreground">{pin.distance}</span>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4 space-y-3">
        <p className="text-sm">{pin.description}</p>
        {photo && (
          <button
            type="button"
            onClick={onPhotoClick}
            className="w-full overflow-hidden rounded-md border shadow-sm hover:opacity-90 transition-opacity"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-32 object-cover"
            />
          </button>
        )}
        {pin.tips && (
          <div className="rounded-md bg-muted px-3 py-2 text-sm border-l-2 border-primary">
            <span className="font-medium text-xs uppercase tracking-wide text-primary">
              Tips
            </span>
            <p className="text-muted-foreground mt-0.5">{pin.tips}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
