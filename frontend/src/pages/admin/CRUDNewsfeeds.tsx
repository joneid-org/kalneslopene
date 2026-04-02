import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  NewspaperIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { kyClient } from "@/api/queryClient.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

// ─── NewsfeedForm ──────────────────────────────────────────────────────────────

function NewsfeedForm({
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
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CRUDNewsfeeds() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["newsfeed", "getAll"] });

  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (newsfeed: Omit<NewsFeedDTO, "uuid">) =>
      kyClient
        .post("/api/newsfeeds/createNewsfeed", { json: newsfeed })
        .json<NewsFeedDTO>(),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<NewsFeedDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (newsfeed: NewsFeedDTO) =>
      kyClient
        .patch(`/api/newsfeeds/${newsfeed.uuid}`, { json: newsfeed })
        .json<NewsFeedDTO>(),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<NewsFeedDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      kyClient.delete(`/api/newsfeeds/${uuid}`).json<void>(),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
    },
  });

  const displayed = [...(newsfeeds ?? [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Nyheter</h1>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til nyhet
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <NewspaperIcon className="size-4 text-primary" />
            Alle nyheter
            <Badge variant="secondary">{displayed.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dato</TableHead>
                <TableHead>Overskrift</TableHead>
                <TableHead className="hidden sm:table-cell">Tagger</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground py-6 text-sm italic"
                  >
                    Ingen nyheter registrert.
                  </TableCell>
                </TableRow>
              )}
              {displayed.map((feed) => (
                <TableRow key={feed.uuid}>
                  <TableCell className="text-muted-foreground tabular-nums whitespace-nowrap">
                    {formatDateFull(feed.date)}
                  </TableCell>
                  <TableCell className="font-medium">{feed.header}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {feed.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing(feed)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(feed)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Legg til nyhet</DialogTitle>
          </DialogHeader>
          <NewsfeedForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(n) => addMutation.mutate(n)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rediger nyhet</DialogTitle>
          </DialogHeader>
          {editing && (
            <NewsfeedForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(n) => editMutation.mutate({ ...editing, ...n })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett nyhet</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Er du sikker på at du vil slette nyheten{" "}
            <span className="font-semibold text-foreground">
              {deleting?.header}
            </span>
            ? Dette kan ikke angres.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleting?.uuid && deleteMutation.mutate(deleting.uuid)
              }
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
