import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { CompletedRacesCard } from "@/components/admin/CompletedRacesCard.tsx";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { MissingRunnersCard } from "@/components/admin/MissingRunnersCard.tsx";
import { PastRaceEditDialog } from "@/components/admin/PastRaceEditDialog.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog } from "@/components/ui/dialog.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const now = new Date();

export function RegisterResults() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: races } = useQuery(QUERIES.race.getAllRaces({ to: now }));

  const [withoutRunners, withRunners] = (races ?? []).partition(
    (r) => r.runnerCount === 0,
  );

  const [editing, setEditing] = useState<RaceDTO | null>(null);
  const [deleting, setDeleting] = useState<RaceDTO | null>(null);
  const [expandedRaceUuid, setExpandedRaceUuid] = useState<string | null>(null);

  const toggleExpanded = (race: RaceDTO) =>
    setExpandedRaceUuid((prev) =>
      prev === race.uuid ? null : (race.uuid ?? null),
    );

  const openEditing = async (race: RaceDTO) => {
    setEditing(race);
  };

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => QUERIES.race.deleteRace(uuid).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
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

      <h1 className="text-2xl font-semibold tracking-tight">
        Registrer resultater
      </h1>

      <MissingRunnersCard
        races={withoutRunners}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      <CompletedRacesCard
        races={withRunners}
        expandedRaceUuid={expandedRaceUuid}
        onToggleExpand={toggleExpanded}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        {editing && (
          <PastRaceEditDialog race={editing} onClose={() => setEditing(null)} />
        )}
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        {deleting && (
          <ConfirmDeleteDialog
            title="Slett løp"
            description={
              <>
                Er du sikker på at du vil slette løpet{" "}
                <span className="font-semibold text-foreground">
                  {formatDDMonth(deleting.raceDate)}
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
