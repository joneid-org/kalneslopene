import { CircleDashedIcon } from "lucide-react";
import { PastRacesTable } from "@/components/admin/PastRacesTable.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { RaceDTO } from "@/model/DTO.ts";

export function UnpublishedResultsCard({
  races,
  expandedRaceUuid,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  races: RaceDTO[];
  expandedRaceUuid: string | null;
  onToggleExpand: (race: RaceDTO) => void;
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
}) {
  if (races.length === 0) return null;

  return (
    <Card className="border-red-200 dark:border-red-900">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CircleDashedIcon className="size-4 text-red-600" />
          Upubliserte resultater
          <Badge variant="secondary">{races.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <PastRacesTable
          rows={races}
          expandable
          expandedRaceUuid={expandedRaceUuid}
          onToggleExpand={onToggleExpand}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
}
