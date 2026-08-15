import { CheckCircle2Icon } from "lucide-react";
import { useMemo } from "react";
import { PastRacesTable } from "@/components/admin/PastRacesTable.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { toLocalDateTimeString } from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const NOW = toLocalDateTimeString(new Date());

const skeletonRows = [0, 1, 2, 3];

export function CompletedRacesCard({
  races: allRaces,
  expandedRaceUuid,
  onToggleExpand,
  onEdit,
  onDelete,
  isLoading = false,
}: {
  races: RaceDTO[];
  expandedRaceUuid: string | null;
  onToggleExpand: (race: RaceDTO) => void;
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
  isLoading?: boolean;
}) {
  const races = useMemo(
    () => allRaces.filter((race) => race.isPublished && race.raceDate <= NOW),
    [allRaces],
  );
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-green-600" />
          Gjennomførte løp
          {!isLoading && <Badge variant="secondary">{races.length}</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex flex-col gap-3 px-4 py-4" aria-busy="true">
            {skeletonRows.map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="h-4 flex-1 animate-pulse rounded bg-muted" />
                <div className="h-4 w-12 shrink-0 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : races.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm italic">
            Ingen gjennomførte løp med registrerte løpere ennå.
          </p>
        ) : (
          <PastRacesTable
            rows={races}
            expandable
            expandedRaceUuid={expandedRaceUuid}
            onToggleExpand={onToggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}
