import { ImagePlus, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";

type Props = {
  fileName: string;
  onReplace: (fileName: string, file: File) => Promise<void> | void;
  className?: string;
};

/**
 * Admin-only control that replaces a static image in place. Renders a file
 * picker button and forwards the picked file to `onReplace` together with the
 * target file name. Only meant to be rendered when an admin is logged in.
 */
export function ReplacePhotoButton({ fileName, onReplace, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(false);
    try {
      await onReplace(fileName, file);
    } catch {
      setError(true);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        aria-label="Bytt bilde"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className={cn("gap-2 shadow", className)}
        disabled={uploading}
        onClick={(event) => {
          event.stopPropagation();
          inputRef.current?.click();
        }}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ImagePlus className="size-4" />
        )}
        {error ? "Prøv igjen" : uploading ? "Laster opp…" : "Bytt bilde"}
      </Button>
    </>
  );
}
