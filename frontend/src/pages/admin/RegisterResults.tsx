import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import { formatDDMonth, raceDateToSortKey } from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function RegisterResults() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidateRaces = () =>
    qc.invalidateQueries({ queryKey: ["race", "getAll"] });

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const past = [...(races ?? [])]
    .filter((r) => isPast(r))
    .sort((a, b) =>
      raceDateToSortKey(b.raceDate).localeCompare(
        raceDateToSortKey(a.raceDate),
      ),
    );

  const runnerResults = useQueries({
    queries: past.map((r) => ({
      ...QUERIES.race.getAllRunnersInRace(r.uuid ?? ""),
      enabled: !!r.uuid,
    })),
  });

  const runnerCountByRace = new Map<string, number>(
    past.map((r, i) => [r.uuid ?? "", runnerResults[i].data?.length ?? 0]),
  );

  const withoutRunners = past.filter(
    (r) => runnerCountByRace.get(r.uuid ?? "") === 0,
  );
  const withRunners = past.filter(
    (r) => (runnerCountByRace.get(r.uuid ?? "") ?? 0) > 0,
  );

  const [editing, setEditing] = useState<RaceDTO | null>(null);
  const [deleting, setDeleting] = useState<RaceDTO | null>(null);
  const [expandedRaceUuid, setExpandedRaceUuid] = useState<string | null>(null);

  const toggleExpanded = (race: RaceDTO) =>
    setExpandedRaceUuid((prev) =>
      prev === race.uuid ? null : (race.uuid ?? null),
    );

  const openEditing = async (race: RaceDTO) => {
    const idx = past.findIndex((r) => r.uuid === race.uuid);
    if (!runnerResults[idx]?.data) {
      await qc.fetchQuery(QUERIES.race.getAllRunnersInRace(race.uuid ?? ""));
    }
    setEditing(race);
  };

  const runnersForRace = (race: RaceDTO) =>
    runnerResults[past.findIndex((r) => r.uuid === race.uuid)]?.data ?? [];

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => QUERIES.race.deleteRace(uuid).queryFn(),
    onSuccess: () => {
      invalidateRaces();
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

      <h1 className="text-2xl font-bold tracking-tight">
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
        runnerCountByRace={runnerCountByRace}
        runnersForRace={runnersForRace}
        onToggleExpand={toggleExpanded}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        {editing && (
          <PastRaceEditDialog
            race={editing}
            initialRunners={runnersForRace(editing)}
            onClose={() => setEditing(null)}
            onSaved={invalidateRaces}
          />
        )}
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
