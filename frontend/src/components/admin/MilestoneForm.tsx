import { useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { milestoneIcons } from "@/components/History/milestoneIcons.ts";
import { Button } from "@/components/ui/button.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import type { MilestoneDTO, MilestoneInput } from "@/model/DTO.ts";

export function MilestoneForm({
  initial,
  onSubmit,
  onCancel,
  onDelete,
  submitLabel,
}: {
  initial: Partial<MilestoneDTO>;
  onSubmit: (milestone: MilestoneInput) => void;
  onCancel: () => void;
  onDelete?: () => void;
  submitLabel: string;
}) {
  const [year, setYear] = useState(initial.year ?? "");
  const [icon, setIcon] = useState(initial.icon ?? "Flag");
  const [title, setTitle] = useState(initial.title ?? "");
  const [summary, setSummary] = useState(initial.summary ?? "");
  const [extra, setExtra] = useState(initial.extra ?? "");
  const [detailsInput, setDetailsInput] = useState(() =>
    (initial.details ?? []).join("\n"),
  );

  const handleSubmit = () => {
    const details = detailsInput.split("\n").flatMap((line) => {
      const trimmed = line.trim();
      return trimmed ? [trimmed] : [];
    });
    onSubmit({
      year: year.trim(),
      icon,
      title: title.trim(),
      summary: summary.trim(),
      extra: extra.trim() || undefined,
      details,
    });
  };

  const isValid = year.trim() && title.trim() && summary.trim();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>År</Label>
          <Input
            placeholder="1978"
            maxLength={10}
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Ikon</Label>
          <Select value={icon} onValueChange={setIcon}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(milestoneIcons).map(([name, Icon]) => (
                <SelectItem key={name} value={name}>
                  <Icon className="size-4" />
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Tittel</Label>
        <Input
          placeholder="En idé blir til"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Beskrivelse</Label>
        <Textarea
          placeholder="Fortell om milepælen..."
          className="max-h-72 min-h-40"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Tom linje mellom avsnitt
        </p>
      </div>
      <div className="space-y-1.5">
        <Label>Sitat</Label>
        <Textarea
          placeholder="Løper ikke for å vinne, men for fellesskapet"
          className="min-h-16"
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Vises som uthevet sitat ved siden av kortet. La stå tom for å skjule.
        </p>
      </div>
      <div className="space-y-1.5">
        <Label>Nøkkelpunkter</Label>
        <Textarea
          placeholder={"Arrangør:Bedriftsidretten\nFormat:Ukentlig prøveløp"}
          className="max-h-40 min-h-20"
          value={detailsInput}
          onChange={(e) => setDetailsInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Ett punkt per linje, på formen Etikett:Verdi
        </p>
      </div>
      <DialogFooter className={onDelete ? "sm:justify-between" : undefined}>
        {onDelete && <DeleteButton size="default" onClick={onDelete} />}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Avbryt
          </Button>
          <Button disabled={!isValid} onClick={handleSubmit}>
            {submitLabel}
          </Button>
        </div>
      </DialogFooter>
    </div>
  );
}
