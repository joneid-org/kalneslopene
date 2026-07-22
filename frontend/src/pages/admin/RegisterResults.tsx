import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { CompletedRacesCard } from "@/components/admin/CompletedRacesCard.tsx";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { MissingRunnersCard } from "@/components/admin/MissingRunnersCard.tsx";
import { UnpublishedResultsCard } from "@/components/admin/UnpublishedResultsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog } from "@/components/ui/dialog.tsx";
import { YearSelector } from "@/components/YearSelector.tsx";
import {
  extractYear,
  formatDDMonth,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const now = new Date();

export function RegisterResults() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: races } = useQuery(QUERIES.race.getAllRaces({ to: now }));

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const availableYears = useMemo(() => getYears(races ?? []), [races]);
  const effectiveYear = selectedYear ?? availableYears[0];

  const yearRaces = useMemo(
    () =>
      (races ?? [])
        .filter((r) => extractYear(r.raceDate) === effectiveYear)
        .sort((a, b) =>
          raceDateToSortKey(b.raceDate).localeCompare(
            raceDateToSortKey(a.raceDate),
          ),
        ),
    [races, effectiveYear],
  );

  const [withoutRunners, withRunners] = yearRaces.partition(
    (r) => r.runnerCount === 0,
  );
  const [publishedRaces, unpublishedRaces] = withRunners.partition(
    (r) => r.isPublished,
  );

  const [deleting, setDeleting] = useState<RaceDTO | null>(null);
  const [expandedRaceUuid, setExpandedRaceUuid] = useState<string | null>(null);

  const toggleExpanded = (race: RaceDTO) =>
    setExpandedRaceUuid((prev) =>
      prev === race.uuid ? null : (race.uuid ?? null),
    );

  const openEditing = (race: RaceDTO) => {
    if (race.uuid) navigate(`/admin/results/${race.uuid}`);
  };

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => MUTATIONS.race.deleteRace(uuid),
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

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrer resultater
        </h1>
        {availableYears.length > 0 && (
          <YearSelector
            years={availableYears}
            value={effectiveYear}
            onChange={(v) => setSelectedYear(v === "all" ? undefined : v)}
          />
        )}
      </div>

      <MissingRunnersCard
        races={withoutRunners}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      <UnpublishedResultsCard
        races={unpublishedRaces}
        expandedRaceUuid={expandedRaceUuid}
        onToggleExpand={toggleExpanded}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      <CompletedRacesCard
        races={publishedRaces}
        expandedRaceUuid={expandedRaceUuid}
        onToggleExpand={toggleExpanded}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

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
