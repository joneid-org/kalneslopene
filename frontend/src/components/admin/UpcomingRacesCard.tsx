import { CalendarClockIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { RowActions } from "@/components/admin/RowActions.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import { getDayAndMonth, getTimestamp } from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function UpcomingRacesCard({
  races,
  onEdit,
  onDelete,
}: {
  races: RaceDTO[];
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
}) {
  return (
    <AdminCard
      icon={<CalendarClockIcon className="size-4 text-primary" />}
      title="Kommende løp"
      items={races}
      columns={[
        { label: "Dato" },
        { label: "Tid" },
        { label: "", className: "w-20" },
      ]}
      emptyText="Ingen kommende løp registrert."
      renderRow={(race) => (
        <>
          <TableCell className="flex items-center gap-2">
            <CalendarClockIcon className="size-3.5 text-primary shrink-0" />
            <span className="font-medium">{getDayAndMonth(race.raceDate)}</span>
          </TableCell>
          <TableCell className="tabular-nums text-muted-foreground">
            {getTimestamp(race.raceDate)}
          </TableCell>
          <RowActions
            onEdit={() => onEdit(race)}
            onDelete={() => onDelete(race)}
          />
        </>
      )}
    />
  );
}
