import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { CompletedRacesCard } from "@/components/admin/CompletedRacesCard.tsx";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { UnpublishedResultsCard } from "@/components/admin/UnpublishedResultsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog } from "@/components/ui/dialog.tsx";
import { YearSelector } from "@/components/YearSelector.tsx";
import {
  addHoursToDate,
  endOfYearString,
  formatDDMonth,
  startOfYearString,
  toLocalDateTimeString,
} from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const NOW = new Date();

export function RegisterResults() {
  const qc = useQueryClient();
  const navigate = useNavigate();

  const { data: raceInfos } = useQuery(QUERIES.race.getAllRaceInfos());

  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const availableYears = useMemo(() => getYears(raceInfos ?? []), [raceInfos]);
  const effectiveYear = selectedYear ?? availableYears[0];

  const { data: yearRacesData } = useQuery({
    ...QUERIES.race.getRaces({
      filter: {
        from: startOfYearString(effectiveYear),
        to:
          effectiveYear === NOW.getFullYear()
            ? toLocalDateTimeString(addHoursToDate(NOW, 2))
            : endOfYearString(effectiveYear),
      },
      pageSize: null,
    }),
    enabled: effectiveYear != null,
  });
  const yearRaces = yearRacesData?.content ?? [];

  const [deleting, setDeleting] = useState<RaceDTO | null>(null);
  const [expandedRaceUuid, setExpandedRaceUuid] = useState<string | null>(null);

  const toggleExpanded = (race: RaceDTO) =>
    setExpandedRaceUuid((prev) =>
      prev === race.uuid ? null : (race.uuid ?? null),
    );

  const openEditing = (race: RaceDTO) => {
    if (race.uuid) navigate(`/admin/resultater/${race.uuid}`);
  };

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => MUTATIONS.race.deleteRace(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race"] });
      setDeleting(null);
    },
  });

  return (
    <div className="page-content max-w-4xl mx-auto space-y-6">
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

      <UnpublishedResultsCard
        races={yearRaces}
        expandedRaceUuid={expandedRaceUuid}
        onToggleExpand={toggleExpanded}
        onEdit={openEditing}
        onDelete={setDeleting}
      />

      <CompletedRacesCard
        races={yearRaces}
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
