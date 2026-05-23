import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { RunnerForm } from "@/components/admin/RunnerForm.tsx";
import { RunnersCard } from "@/components/admin/RunnersCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

export function CRUDRunners() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const { data: runners } = useQuery(
    QUERIES.runner.getAllRunners(search || undefined),
  );

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (runner: Omit<RunnerDTO, "uuid">) =>
      QUERIES.runner.createRunners([runner as RunnerDTO]).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<RunnerDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (runner: RunnerDTO) =>
      QUERIES.runner.updateRunner(runner.uuid, runner).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<RunnerDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => QUERIES.runner.deleteRunner(uuid).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
      setDeleting(null);
    },
  });

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Løpere</h1>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til løper
        </Button>
      </div>

      <RunnersCard
        runners={runners ?? []}
        search={search}
        onSearchChange={setSearch}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til løper</DialogTitle>
          </DialogHeader>
          <RunnerForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(r) => addMutation.mutate(r)}
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
            <DialogTitle>Rediger løper</DialogTitle>
          </DialogHeader>
          {editing && (
            <RunnerForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(r) => editMutation.mutate({ ...editing, ...r })}
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
            title="Slett løper"
            description={
              <>
                Er du sikker på at du vil slette{" "}
                <span className="font-semibold text-foreground">
                  {deleting.name}
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
