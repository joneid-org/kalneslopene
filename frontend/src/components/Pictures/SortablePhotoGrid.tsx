import { arrayMove } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
} from "@/components/reui/sortable.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { S3FileDto } from "@/model/DTO.ts";

type SortablePhotoGridProps = {
  photos: S3FileDto[];
  onReorder: (movedUuid: string, newOrder: S3FileDto[]) => void;
};

export function SortablePhotoGrid({
  photos,
  onReorder,
}: SortablePhotoGridProps) {
  // Mirrors `photos` locally so a drop updates the visible order in the same
  // synchronous render as dnd-kit clearing its drag state. Waiting for the
  // reorder mutation's query-cache update to flow back through `photos`
  // arrives a render late (cache notifications are microtask-deferred) and
  // shows up as a flicker: the dropped photo snaps back, then snaps again.
  const [items, setItems] = useState(photos);
  useEffect(() => setItems(photos), [photos]);

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">
        Ingen bilder tilgjengelig.
      </p>
    );
  }

  return (
    <Card>
      <CardContent className="py-3 px-2 sm:px-4">
        <Sortable
          value={items}
          getItemValue={(photo) => photo.uuid}
          onValueChange={() => {}}
          onMove={({ event, activeIndex, overIndex }) => {
            const newOrder = arrayMove(items, activeIndex, overIndex);
            setItems(newOrder);
            onReorder(String(event.active.id), newOrder);
          }}
          strategy="grid"
          className="grid grid-cols-1 sm:grid-cols-3 gap-2"
        >
          {items.map((photo) => (
            <SortableItem key={photo.uuid} value={photo.uuid}>
              <div className="relative aspect-video sm:aspect-square overflow-hidden rounded-md">
                <img
                  src={photo.url}
                  alt={photo.description}
                  draggable={false}
                  className="w-full h-full object-cover"
                />
                <SortableItemHandle className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white">
                  <GripVertical className="size-4" />
                </SortableItemHandle>
              </div>
            </SortableItem>
          ))}
        </Sortable>
      </CardContent>
    </Card>
  );
}
