import { Upload } from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface UploadDropzoneProps {
  onFilesSelected: (files: FileList) => void;
}

export function UploadDropzone({ onFilesSelected }: UploadDropzoneProps) {
  const filePickerRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    filePickerRef.current?.click();
  };

  const onFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
  };

  const onDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const onDropFiles = (event: React.DragEvent) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      onFilesSelected(event.dataTransfer.files);
    }
  };

  return (
    <Card
      className="group flex max-h-[200px] w-full flex-col items-center justify-center gap-4 py-8 border-dashed text-sm cursor-pointer hover:bg-muted/50 transition-colors"
      onDragOver={onDragOver}
      onDrop={onDropFiles}
      onClick={openFilePicker}
    >
      <div className="grid space-y-3">
        <div className="flex items-center gap-x-2 text-muted-foreground">
          <Upload className="size-5" />
          <div>
            Slipp filer her eller{" "}
            <Button
              variant="link"
              className="text-primary p-0 h-auto font-normal"
            >
              bla gjennom
            </Button>{" "}
          </div>
        </div>
      </div>
      <input
        ref={filePickerRef}
        type="file"
        className="hidden"
        multiple
        onChange={onFileInputChange}
      />
    </Card>
  );
}
