import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
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
  const [tagsInput, setTagsInput] = useState((initial.tags ?? []).join(", "));
  const [date, setDate] = useState(
    initial.date
      ? new Date(initial.date).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10),
  );

  const handleSubmit = () => {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      header: header.trim(),
      content: content.trim(),
      tags,
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
        <Input
          placeholder="løp, resultater, nyhet"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Kommaseparert liste</p>
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
