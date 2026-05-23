import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { NewsfeedForm } from "@/components/admin/NewsfeedForm.tsx";
import { NewsfeedsCard } from "@/components/admin/NewsfeedsCard.tsx";
import { NewsfeedTagManager } from "@/components/admin/NewsfeedTagManager.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export function CRUDNewsfeeds() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);
  const { data: settings } = useQuery(QUERIES.newsfeed.getSettings);
  const [maxArticles, setMaxArticles] = useState<number | undefined>(undefined);

  const settingsMutation = useMutation({
    mutationFn: (max: number) =>
      QUERIES.newsfeed.updateSettings({ maxArticles: max }).queryFn(),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["newsfeed", "settings"] }),
  });

  const currentMax = maxArticles ?? settings?.maxArticles ?? 10;

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (newsfeed: Omit<NewsFeedDTO, "uuid">) =>
      QUERIES.newsfeed.createNewsFeed(newsfeed as NewsFeedDTO).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "getAll"] });
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<NewsFeedDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (newsfeed: NewsFeedDTO) =>
      QUERIES.newsfeed.updateNewsFeed(newsfeed.uuid, newsfeed).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "getAll"] });
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<NewsFeedDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      QUERIES.newsfeed.deleteNewsFeed(uuid).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["newsfeed", "getAll"] });
      setDeleting(null);
    },
  });

  const displayed = (newsfeeds ?? []).toSorted(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="page-content max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>
      <h1 className="text-2xl font-semibold tracking-tight">Nyheter</h1>

      <div className="rounded-lg border p-4 space-y-3">
        <h2 className="text-base font-semibold">Innstillinger</h2>
        <div className="flex items-end gap-3">
          <div className="space-y-1.5 flex-1 max-w-[200px]">
            <Label>Antall artikler på forsiden</Label>
            <Input
              type="number"
              min={1}
              max={50}
              value={currentMax}
              onChange={(e) => setMaxArticles(Number(e.target.value))}
            />
          </div>
          <Button
            onClick={() => settingsMutation.mutate(currentMax)}
            disabled={settingsMutation.isPending}
          >
            Lagre
          </Button>
        </div>
      </div>

      <Separator />

      <NewsfeedTagManager />

      <Separator />

      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Artikler</h2>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til nyhet
        </Button>
      </div>

      <NewsfeedsCard
        newsfeeds={displayed}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

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

      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        {deleting && (
          <ConfirmDeleteDialog
            title="Slett nyhet"
            description={
              <>
                Er du sikker på at du vil slette nyheten{" "}
                <span className="font-semibold text-foreground">
                  {deleting.header}
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
