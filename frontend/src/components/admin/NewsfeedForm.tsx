import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { PREDEFINED_TAGS, tagBg } from "@/components/NewsFeedStories.tsx";
import type { NewsFeedDTO } from "@/model/DTO.ts";

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

  const toggleTag = (value: string) => {
    setSelectedTags((prev) =>
      prev.includes(value) ? prev.filter((t) => t !== value) : [...prev, value],
    );
  };

  const handleSubmit = () => {
    onSubmit({
      header: header.trim(),
      content: content.trim(),
      tags: selectedTags,
      date: new Date(date) as unknown as Date,
    });
  };

  const isValid = header.trim() && content.trim() && date;

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
        <Textarea
          placeholder="Skriv nyhetsinnholdet her..."
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
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
                      className={`${tagBg(tag)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}
                    >
                      {PREDEFINED_TAGS.find((t) => t.value === tag)?.label ??
                        tag}
                    </span>
                  ))}
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {PREDEFINED_TAGS.map((tag) => (
              <DropdownMenuCheckboxItem
                key={tag.value}
                checked={selectedTags.includes(tag.value)}
                onCheckedChange={() => toggleTag(tag.value)}
                className="gap-2"
              >
                <Badge
                  className={`${tag.color} text-white border-0 text-[9px] font-black uppercase tracking-widest`}
                >
                  {tag.label}
                </Badge>
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
