import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { NewsfeedForm } from "@/components/admin/NewsfeedForm.tsx";
import { NewsfeedsCard } from "@/components/admin/NewsfeedsCard.tsx";
import { Pagination } from "@/components/Pagination.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { NewsFeedDTO } from "@/model/DTO.ts";

const PAGE_SIZE = 10;

export function CRUDNewsfeeds() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { data } = useQuery(
    QUERIES.newsfeed.getNewsFeed(page - 1, PAGE_SIZE, undefined, true),
  );

  const invalidate = () => qc.invalidateQueries({ queryKey: ["newsfeed"] });

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (newsfeed: Omit<NewsFeedDTO, "uuid">) =>
      MUTATIONS.newsfeed.createNewsFeed(newsfeed as NewsFeedDTO),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<NewsFeedDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (newsfeed: NewsFeedDTO) =>
      MUTATIONS.newsfeed.updateNewsFeed(newsfeed.uuid, newsfeed),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<NewsFeedDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => MUTATIONS.newsfeed.deleteNewsFeed(uuid),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
    },
  });

  const displayed = data?.content ?? [];
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const goToPage = (next: number) =>
    setPage(Math.min(Math.max(1, next), totalPages));

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

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader>
            <DialogTitle>Legg til nyhet</DialogTitle>
          </DialogHeader>
          <NewsfeedForm
            initial={{}}
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
        <DialogContent className="flex max-h-[90vh] flex-col">
          <DialogHeader>
            <DialogTitle>Rediger nyhet</DialogTitle>
          </DialogHeader>
          {editing && (
            <NewsfeedForm
              initial={editing}
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
