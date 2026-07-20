import { ImagePlus, Loader2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { requestNewsfeedHeaderUpload } from "@/api/queries.ts";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { RichTextEditor } from "@/components/admin/RichTextEditor.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { tagColor, useTags } from "@/lib/newsUtils.ts";
import { convertImageToWebp } from "@/lib/photoUtils.ts";
import type { NewsFeedDTO, NewsfeedTagDTO, S3FileDto } from "@/model/DTO.ts";

export function NewsfeedForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<NewsFeedDTO>;
  onSubmit: (newsfeed: Omit<NewsFeedDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [header, setHeader] = useState(initial.header ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initial.tags ?? [],
  );
  const [date, setDate] = useState(
    initial.date
      ? new Date(initial.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );
  const [headerImage, setHeaderImage] = useState<S3FileDto | undefined>(
    initial.headerImage,
  );
  const [uploading, setUploading] = useState(false);
  const availableTags = useTags();
  const selectedTagsSet = useMemo(() => new Set(selectedTags), [selectedTags]);

  const headerImageRef = useRef<HTMLInputElement>(null);

  const toggleTag = (value: string) => {
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleHeaderImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const original = e.target.files?.[0];
    if (!original) return;
    setUploading(true);
    try {
      const file = await convertImageToWebp(original);
      const { uploadUrl, s3File } = await requestNewsfeedHeaderUpload(
        file.name,
      );
      const res = await fetch(uploadUrl, { method: "PUT", body: file });
      if (!res.ok) throw new Error(`Opplasting feilet (${res.status})`);
      setHeaderImage(s3File);
    } finally {
      setUploading(false);
      if (headerImageRef.current) headerImageRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    onSubmit({
      header: header.trim(),
      content: content.trim(),
      tags: selectedTags,
      date: new Date(date) as unknown as Date,
      headerImage,
      images: [],
    });
  };

  const isValid =
    header.trim() &&
    content.replace(/<[^>]+>/g, "").trim() &&
    date &&
    !uploading;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Overskrift</Label>
        <Input
          placeholder="Tittel på nyhet"
          value={header}
          onChange={(e) => setHeader(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Innhold</Label>
        <RichTextEditor value={content} onChange={setContent} />
      </div>
      <div className="space-y-1.5">
        <Label>Dato</Label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Tagger</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              {selectedTags.length === 0 ? (
                <span className="text-muted-foreground">Velg tagger...</span>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {selectedTags.map((tag) => (
                    <span
                      key={tag}
                      className="tag-pill"
                      style={{ color: tagColor(tag, availableTags) }}
                    >
                      {availableTags.find((t) => t.value === tag)?.value ?? tag}
                    </span>
                  ))}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {availableTags.map((tag: NewsfeedTagDTO) => (
              <DropdownMenuCheckboxItem
                key={tag.value}
                checked={selectedTagsSet.has(tag.value)}
                onCheckedChange={() => toggleTag(tag.value)}
                className="gap-2"
              >
                <span className="tag-pill" style={{ color: tag.color }}>
                  {tag.value}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-1.5">
        <Label>Header-bilde</Label>
        <input
          ref={headerImageRef}
          type="file"
          accept="image/*"
          aria-label="Last opp header-bilde"
          className="hidden"
          onChange={handleHeaderImageChange}
        />
        {headerImage ? (
          <div className="relative w-full rounded-md overflow-hidden border flex justify-center">
            <img
              src={headerImage.url}
              alt="Header"
              className="max-w-full h-auto"
            />
            <button
              type="button"
              aria-label="Fjern header-bilde"
              onClick={() => {
                setHeaderImage(undefined);
                if (headerImageRef.current) headerImageRef.current.value = "";
              }}
              className="absolute top-1.5 right-1.5 bg-gray-950 text-white rounded-full p-0.5 hover:bg-gray-800"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            disabled={uploading}
            onClick={() => headerImageRef.current?.click()}
          >
            {uploading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <ImagePlus className="size-4" />
            )}
            {uploading ? "Laster opp..." : "Velg header-bilde fra fil"}
          </Button>
        )}
      </div>

      <FormFooter
        submitLabel={submitLabel}
        disabled={!isValid}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
