import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { S3FileDto } from "@/model/DTO.ts";
import type { UploadItem } from "@/pages/admin/Images.tsx";

export function AdminPhotoGrid({
  photos,
  uploads = [],
  onBulkDelete,
  onDismissUpload,
}: {
  photos: S3FileDto[];
  uploads?: UploadItem[];
  onBulkDelete: (photoIds: string[]) => Promise<void>;
  onDismissUpload?: (uploadId: string) => void;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const existing = new Set(photos.map((p) => p.uuid));
    setSelected((prev) => {
      const next = new Set([...prev].filter((id) => existing.has(id)));
      return next.size === prev.size ? prev : next;
    });
  }, [photos]);

  if (photos.length === 0 && uploads.length === 0) {
    return null;
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onBulkDelete([...selected]);
      setSelected(new Set());
      setConfirmOpen(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const selectedCount = selected.size;
  const allSelected = photos.length > 0 && selectedCount === photos.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(photos.map((p) => p.uuid)));
    }
  };

  return (
    <Card>
      <CardContent className="py-3 px-2 sm:px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {uploads.map((upload) => (
            <div
              key={upload.id}
              className="relative aspect-video sm:aspect-square overflow-hidden rounded-md bg-muted"
            >
              <img
                src={upload.previewUrl}
                alt={upload.name}
                className="w-full h-full object-cover opacity-60"
              />
              {upload.status === "uploading" && (
                <>
                  <div className="absolute inset-x-0 bottom-0 h-1 bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${upload.progress}%` }}
                    />
                  </div>
                  <div className="absolute top-1.5 left-1.5 rounded bg-background/80 px-1.5 py-0.5 text-xs font-medium">
                    Laster opp {upload.progress}%
                  </div>
                </>
              )}
              {upload.status === "error" && (
                <>
                  <div className="absolute inset-x-0 bottom-0 bg-destructive/90 px-2 py-1 text-xs text-destructive-foreground">
                    Feil: {upload.error ?? "Opplasting feilet"}
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon-sm"
                    aria-label="Avvis feilet opplasting"
                    onClick={() => onDismissUpload?.(upload.id)}
                    className="absolute top-1.5 right-1.5"
                  >
                    <X className="size-4" />
                  </Button>
                </>
              )}
            </div>
          ))}
          {photos.map((photo) => {
            const isSelected = selected.has(photo.uuid);
            return (
              <button
                key={photo.uuid}
                type="button"
                aria-pressed={isSelected}
                aria-label={isSelected ? "Fjern markering" : "Marker bilde"}
                onClick={() => toggle(photo.uuid)}
                className="relative aspect-video sm:aspect-square overflow-hidden rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <img
                  src={photo.url}
                  alt="Løpsbilde"
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <>
                    <div className="absolute inset-0 bg-primary/30 ring-2 ring-primary ring-inset rounded-md" />
                    <div className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                      <Check className="size-4" />
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {selectedCount > 0 && (
          <div className="mt-3 flex items-center justify-between gap-3 rounded-md border bg-muted/40 px-3 py-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{selectedCount} valgt</span>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={toggleSelectAll}
                disabled={isDeleting}
              >
                {allSelected ? "Fjern alle" : "Velg alle"}
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setSelected(new Set())}
                disabled={isDeleting}
              >
                Avbryt
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => setConfirmOpen(true)}
                disabled={isDeleting}
              >
                Slett
              </Button>
            </div>
          </div>
        )}
      </CardContent>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett {selectedCount} bilder?</DialogTitle>
            <DialogDescription>Dette kan ikke angres.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirmOpen(false)}
              disabled={isDeleting}
            >
              Avbryt
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Sletter..." : "Slett"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
