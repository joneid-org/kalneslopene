import { MapPin } from "lucide-react";
import { useState } from "react";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { ReplacePhotoButton } from "@/components/ReplacePhotoButton.tsx";
import type { Pin } from "@/data/loypekartData.ts";
import { useAuth } from "@/hooks/useAuth.ts";
import { useStaticPhotos } from "@/hooks/useStaticPhotos.tsx";

type Props = {
  pin: Pin;
};

export function PinInfoPanel({ pin }: Props) {
  const { isAuthenticated } = useAuth();
  const { resolvePhotoUrl, handleReplacePhoto } = useStaticPhotos();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photo = pin.photo;
  const photoUrl = resolvePhotoUrl(photo.fileName, photo.fallback);
  const onReplacePhoto = isAuthenticated ? handleReplacePhoto : undefined;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className="relative h-[170px] shrink-0 overflow-hidden bg-muted">
        <button
          type="button"
          className="group block size-full cursor-zoom-in"
          aria-label="Åpne bilde i fullskjerm"
          onClick={() => setLightboxIndex(0)}
        >
          <img
            src={photoUrl}
            alt={pin.label}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </button>
        {onReplacePhoto && photo?.fileName && (
          <ReplacePhotoButton
            fileName={photo.fileName}
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
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
          {pin.description}
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
        onReplacePhoto={onReplacePhoto}
      />
    </div>
  );
}
