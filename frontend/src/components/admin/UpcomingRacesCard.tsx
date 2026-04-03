import { CalendarClockIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
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
          <TableCell>
            <div className="flex items-center gap-2">
              <CalendarClockIcon className="size-3.5 text-primary shrink-0" />
              <span className="font-medium">
                {formatDDMonth(race.raceDate)}
              </span>
            </div>
          </TableCell>
          <TableCell className="tabular-nums text-muted-foreground">
            {formatTimeStamp(race.raceDate)}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1 justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => onEdit(race)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(race)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    />
  );
}
