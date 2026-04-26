import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { OrganizerForm } from "@/components/admin/OrganizerForm.tsx";
import { OrganizersCard } from "@/components/admin/OrganizersCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useOrganizerOrder } from "@/lib/organizerOrder.ts";
import type { OrganizerDTO } from "@/model/DTO.ts";

// ─── Main component ────────────────────────────────────────────────────────────

export function CRUDOrganizers() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["organizer", "getAll"] });

  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const { ordered, move } = useOrganizerOrder(organizers ?? []);

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (organizer: Omit<OrganizerDTO, "uuid">) =>
      QUERIES.organizer.createOrganizer(organizer as OrganizerDTO).queryFn(),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<OrganizerDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (organizer: OrganizerDTO) =>
      QUERIES.organizer.updateOrganizer(organizer.uuid!, organizer).queryFn(),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<OrganizerDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      QUERIES.organizer.deleteOrganizer(uuid).queryFn(),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
    },
  });

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
        <h1 className="text-2xl font-bold tracking-tight">Organisatorer</h1>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til organisator
        </Button>
      </div>

      <OrganizersCard
        organizers={ordered}
        onEdit={setEditing}
        onDelete={setDeleting}
        onReorder={move}
      />

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til organisator</DialogTitle>
          </DialogHeader>
          <OrganizerForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(o) => addMutation.mutate(o)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger organisator</DialogTitle>
          </DialogHeader>
          {editing && (
            <OrganizerForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(o) => editMutation.mutate({ ...editing, ...o })}
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
            title="Slett organisator"
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
