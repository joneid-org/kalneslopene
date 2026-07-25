import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import type { S3FileDto } from "@/model/DTO.ts";

type SortablePhotoGridProps = {
  photos: S3FileDto[];
  onReorder: (movedUuid: string, newOrder: S3FileDto[]) => void;
};

function SortablePhoto({ photo }: { photo: S3FileDto }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: photo.uuid });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={cn(
        "relative aspect-video sm:aspect-square overflow-hidden rounded-md touch-none select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50 z-10",
      )}
    >
      <img
        src={photo.url}
        alt={photo.description}
        draggable={false}
        className="w-full h-full object-cover"
      />
      <div className="absolute top-1 right-1 rounded-full bg-black/50 p-1 text-white">
        <GripVertical className="size-4" />
      </div>
    </div>
  );
}

export function SortablePhotoGrid({
  photos,
  onReorder,
}: SortablePhotoGridProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  if (photos.length === 0) {
    return (
      <p className="text-sm text-muted-foreground px-1">
        Ingen bilder tilgjengelig.
      </p>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = photos.findIndex((p) => p.uuid === active.id);
    const newIndex = photos.findIndex((p) => p.uuid === over.id);
    onReorder(String(active.id), arrayMove(photos, oldIndex, newIndex));
  }

  return (
    <Card>
      <CardContent className="py-3 px-2 sm:px-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={photos.map((p) => p.uuid)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {photos.map((photo) => (
                <SortablePhoto key={photo.uuid} photo={photo} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}
