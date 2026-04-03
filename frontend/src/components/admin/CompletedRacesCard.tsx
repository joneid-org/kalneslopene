import { CheckCircle2Icon } from "lucide-react";
import { PastRacesTable } from "@/components/admin/PastRacesTable.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function CompletedRacesCard({
  races,
  expandedRaceUuid,
  runnerCountByRace,
  runnersForRace,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  races: RaceDTO[];
  expandedRaceUuid: string | null;
  runnerCountByRace: Map<string, number>;
  runnersForRace: (race: RaceDTO) => RaceRunnerDTO[];
  onToggleExpand: (race: RaceDTO) => void;
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CheckCircle2Icon className="size-4 text-green-600" />
          Gjennomførte løp
          <Badge variant="secondary">{races.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {races.length === 0 ? (
          <p className="text-center text-muted-foreground py-6 text-sm italic">
            Ingen gjennomførte løp med registrerte løpere ennå.
          </p>
        ) : (
          <PastRacesTable
            rows={races}
            expandable={true}
            expandedRaceUuid={expandedRaceUuid}
            runnerCountByRace={runnerCountByRace}
            runnersForRace={runnersForRace}
            onToggleExpand={onToggleExpand}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        )}
      </CardContent>
    </Card>
  );
}
