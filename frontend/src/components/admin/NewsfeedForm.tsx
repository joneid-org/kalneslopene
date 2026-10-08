import { ChevronDown, Clock, ImagePlus, Loader2, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { requestNewsfeedHeaderUpload } from "@/api/queries.ts";
import { RichTextEditor } from "@/components/admin/RichTextEditor.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  isScheduled as isScheduledFor,
  tagColor,
  useTags,
} from "@/lib/newsUtils.ts";
import { convertImageToWebp } from "@/lib/photoUtils.ts";
import { toDateTimeInputValue, toLocalDateString } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO, NewsfeedTagDTO, S3FileDto } from "@/model/DTO.ts";

export function NewsfeedForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial: Partial<NewsFeedDTO>;
  onSubmit: (newsfeed: Omit<NewsFeedDTO, "uuid">) => void;
  onCancel: () => void;
}) {
  const [header, setHeader] = useState(initial.header ?? "");
  const [content, setContent] = useState(initial.content ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(
    initial.tags ?? [],
  );
  const [date, setDate] = useState(() =>
    toLocalDateString(new Date(initial.date ?? Date.now())),
  );
  const [headerImage, setHeaderImage] = useState<S3FileDto | undefined>(
    initial.headerImage,
  );
  const initiallyScheduled = isScheduledFor(initial.publishedAt);
  const [isScheduled, setIsScheduled] = useState(initiallyScheduled);
  const [publishAt, setPublishAt] = useState(() =>
    toDateTimeInputValue(initiallyScheduled ? initial.publishedAt : null),
  );
  const alreadyPublishedAt = initiallyScheduled ? null : initial.publishedAt;
  const effectiveDate = isScheduled ? publishAt : date;
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

  const submit = (publishedAt: string | null) => {
    onSubmit({
      header: header.trim(),
      content: content.trim(),
      tags: selectedTags,
      date: new Date(effectiveDate) as unknown as Date,
      headerImage,
      images: [],
      publishedAt,
    });
  };

  const handlePublish = () =>
    submit(
      isScheduled
        ? new Date(publishAt).toISOString()
        : (alreadyPublishedAt ?? new Date().toISOString()),
    );

  const isValid =
    header.trim() &&
    content.replace(/<[^>]+>/g, "").trim() &&
    effectiveDate &&
    !uploading;

  return (
    <div className="flex min-h-0 flex-col">
      <div className="-mx-6 min-h-0 flex-1 space-y-4 overflow-y-auto px-6 pb-4">
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
        {!isScheduled && (
          <div className="space-y-1.5">
            <Label>Dato</Label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        )}
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
                        {availableTags.find((t) => t.value === tag)?.value ??
                          tag}
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
      </div>

      <PublishFooter
        isLive={!!alreadyPublishedAt}
        disabled={!isValid}
        isScheduled={isScheduled}
        onScheduledChange={setIsScheduled}
        publishAt={publishAt}
        onPublishAtChange={setPublishAt}
        onCancel={onCancel}
        onSaveDraft={() => submit(null)}
        onPublish={handlePublish}
      />
    </div>
  );
}

function PublishFooter({
  isLive,
  disabled,
  isScheduled,
  onScheduledChange,
  publishAt,
  onPublishAtChange,
  onCancel,
  onSaveDraft,
  onPublish,
}: {
  isLive: boolean;
  disabled: boolean;
  isScheduled: boolean;
  onScheduledChange: (value: boolean) => void;
  publishAt: string;
  onPublishAtChange: (value: string) => void;
  onCancel: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}) {
  const publishLabel = isScheduled ? "Planlegg" : isLive ? "Lagre" : "Publiser";

  return (
    <div className="-mx-6 -mb-6 shrink-0 space-y-3 border-t px-6 py-4">
      {isScheduled && (
        <div className="flex items-center gap-2 rounded-md bg-brand-soft px-3 py-2 text-sm">
          <Clock className="size-4 shrink-0 text-brand-soft-foreground" />
          <Label htmlFor="newsfeed-publish-at" className="shrink-0">
            Publiseres
          </Label>
          <Input
            id="newsfeed-publish-at"
            type="datetime-local"
            value={publishAt}
            onChange={(e) => onPublishAtChange(e.target.value)}
            className="h-8 min-w-0 flex-1 bg-background"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Fjern planlagt tidspunkt"
            onClick={() => onScheduledChange(false)}
          >
            <X className="size-4" />
          </Button>
        </div>
      )}
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Avbryt
        </Button>
        <div className="flex-1" />
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onSaveDraft}
        >
          {isLive ? "Avpubliser" : "Lagre utkast"}
        </Button>
        <div className="flex">
          <Button
            type="button"
            disabled={disabled}
            onClick={onPublish}
            className="rounded-r-none"
          >
            {publishLabel}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="icon"
                aria-label="Flere publiseringsvalg"
                className="rounded-l-none border-l border-primary-foreground/30"
              >
                <ChevronDown className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuItem
                onSelect={() => onScheduledChange(false)}
                className="flex-col items-start gap-0.5"
              >
                <span className="font-medium">Publiser nå</span>
                <span className="text-xs text-muted-foreground">
                  Synlig for alle med en gang
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => onScheduledChange(true)}
                className="flex-col items-start gap-0.5"
              >
                <span className="font-medium">Planlegg publisering…</span>
                <span className="text-xs text-muted-foreground">
                  Velg dato og klokkeslett
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
