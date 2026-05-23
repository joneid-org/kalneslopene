import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import type { NewsfeedTagDTO } from "@/model/DTO.ts";

const COLOR_OPTIONS = [
  { label: "Blå", value: "#2563eb" },
  { label: "Mørkeblå", value: "#1e40af" },
  { label: "Lilla", value: "#9333ea" },
  { label: "Grønn", value: "#16a34a" },
  { label: "Orange", value: "#f97316" },
  { label: "Rød", value: "#ef4444" },
  { label: "Rosa", value: "#ec4899" },
  { label: "Gul", value: "#eab308" },
  { label: "Svart", value: "#000000" },
  { label: "Grå", value: "#6b7280" },
];

function TagForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<NewsfeedTagDTO>;
  onSubmit: (dto: Omit<NewsfeedTagDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [label, setLabel] = useState(initial.label ?? "");
  const [value, setValue] = useState(initial.value ?? "");
  const [color, setColor] = useState(initial.color ?? "bg-black");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Navn (vises til brukere)</Label>
        <Input
          placeholder="f.eks. Results"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Verdi (intern nøkkel, liten bokstav)</Label>
        <Input
          placeholder="f.eks. resultater"
          value={value}
          onChange={(e) => setValue(e.target.value.toLowerCase())}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Farge</Label>
        <Select value={color} onValueChange={setColor}>
          <SelectTrigger className="w-full">
            <SelectValue>
              <span className="flex items-center gap-2">
                <span
                  className="inline-block size-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                {COLOR_OPTIONS.find((c) => c.value === color)?.label ?? color}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {COLOR_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: opt.value }}
                  />
                  {opt.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="tag-pill" style={{ color }}>
          {label || "Forhåndsvisning"}
        </span>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button variant="ghost" onClick={onCancel}>
          Avbryt
        </Button>
        <Button
          disabled={!label.trim() || !value.trim()}
          onClick={() =>
            onSubmit({ label: label.trim(), value: value.trim(), color })
          }
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}

export function NewsfeedTagManager() {
  const qc = useQueryClient();

  const { data: tags = [] } = useQuery(QUERIES.newsfeed.getAllTags);

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (dto: Omit<NewsfeedTagDTO, "uuid">) =>
      QUERIES.newsfeed.createTag(dto as NewsfeedTagDTO).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "tags"] });
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<NewsfeedTagDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (dto: NewsfeedTagDTO) =>
      QUERIES.newsfeed.updateTag(dto.uuid, dto).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "tags"] });
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<NewsfeedTagDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => QUERIES.newsfeed.deleteTag(uuid).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "tags"] });
      setDeleting(null);
    },
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Tagger</h2>
        <Button size="sm" className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-3.5" />
          Ny tag
        </Button>
      </div>

      <div className="rounded-md border divide-y">
        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground py-3 px-4">
            Ingen tagger ennå.
          </p>
        )}
        {tags.map((tag) => (
          <div
            key={tag.uuid}
            className="flex items-center justify-between px-4 py-2.5 gap-3"
          >
            <div className="flex items-center gap-2">
              <span className="tag-pill" style={{ color: tag.color }}>
                {tag.label}
              </span>
              <span className="text-xs text-muted-foreground">
                ({tag.value})
              </span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => setEditing(tag)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <DeleteButton onClick={() => setDeleting(tag)} />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ny tag</DialogTitle>
          </DialogHeader>
          <TagForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(dto) => addMutation.mutate(dto)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger tag</DialogTitle>
          </DialogHeader>
          {editing && (
            <TagForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(dto) => editMutation.mutate({ ...editing, ...dto })}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        {deleting && (
          <ConfirmDeleteDialog
            title="Slett tag"
            description={
              <>
                Er du sikker på at du vil slette taggen{" "}
                <span className="font-semibold text-foreground">
                  «{deleting.label}»
                </span>
                ? Dette kan ikke angres.
              </>
            }
            isPending={deleteMutation.isPending}
            onConfirm={() =>
              deleting.uuid && deleteMutation.mutate(deleting.uuid)
            }
            onClose={() => setDeleting(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
