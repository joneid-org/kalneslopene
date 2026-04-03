import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { NewsfeedForm } from "@/components/admin/NewsfeedForm.tsx";
import { NewsfeedsCard } from "@/components/admin/NewsfeedsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { NewsFeedDTO } from "@/model/DTO.ts";

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
      QUERIES.newsfeed.createNewsFeed(newsfeed as NewsFeedDTO).queryFn(),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<NewsFeedDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (newsfeed: NewsFeedDTO) =>
      QUERIES.newsfeed.updateNewsFeed(newsfeed.uuid!, newsfeed).queryFn(),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<NewsFeedDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      QUERIES.newsfeed.deleteNewsFeed(uuid).queryFn(),
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

      <NewsfeedsCard
        newsfeeds={displayed}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

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
