import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronLeftIcon,
  ChevronRight,
  PlusIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
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

const PAGE_SIZE = 10;

function pageItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "...")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push("...");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("...");
  items.push(total);
  return items;
}

export function CRUDNewsfeeds() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const { data } = useQuery(QUERIES.newsfeed.getNewsFeed(page - 1, PAGE_SIZE));

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["newsfeed", "page"] });

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
  const items = pageItems(page, totalPages);

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

      {totalPages > 1 && (
        <nav
          className="flex items-center justify-center gap-1.5 pt-2"
          aria-label="Paginering"
        >
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            aria-label="Forrige side"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {items.map((item, idx) =>
            item === "..." ? (
              <span
                key={`ellipsis-${items[idx - 1]}`}
                className="px-1.5 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                variant={item === page ? "default" : "outline"}
                size="icon-sm"
                onClick={() => goToPage(item)}
                aria-current={item === page ? "page" : undefined}
              >
                {item}
              </Button>
            ),
          )}
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            aria-label="Neste side"
          >
            <ChevronRight className="size-4" />
          </Button>
        </nav>
      )}

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
