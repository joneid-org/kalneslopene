import { UserPlusIcon } from "lucide-react";
import { PastRacesTable } from "@/components/admin/PastRacesTable.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function MissingRunnersCard({
  races,
  onEdit,
  onDelete,
}: {
  races: RaceDTO[];
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
}) {
  if (races.length === 0) return null;

  return (
    <Card className="border-orange-200 dark:border-orange-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <UserPlusIcon className="size-4 text-orange-500" />
          Mangler løpere
          <Badge variant="secondary">{races.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <PastRacesTable
          rows={races}
          expandable={false}
          expandedRaceUuid={null}
          runnerCountByRace={new Map()}
          runnersForRace={() => [] as RaceRunnerDTO[]}
          onToggleExpand={() => {}}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}
