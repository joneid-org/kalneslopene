import { ImagePlus } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button.tsx";

type Picked = { url: string; name: string };

export function ImageUploadButton({
  onFilesPicked,
}: {
  onFilesPicked: (files: Picked[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const picked = files.map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    onFilesPicked(picked);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        aria-label="Last opp bilder"
        className="hidden"
        onChange={handleChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="size-4" />
        Last opp bilder
      </Button>
    </>
  );
}
