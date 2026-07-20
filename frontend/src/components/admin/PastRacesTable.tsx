import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  CircleDashedIcon,
  Loader2Icon,
  PencilIcon,
} from "lucide-react";
import { Fragment, type ReactNode } from "react";
import { QUERIES } from "@/api/queries.ts";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { WeatherLine } from "@/components/Weather/WeatherLine.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  formatTimeStamp,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function PastRacesTable({
  rows,
  expandable,
  expandedRaceUuid,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  rows: RaceDTO[];
  expandable: boolean;
  expandedRaceUuid: string | null;
  onToggleExpand: (race: RaceDTO) => void;
  onEdit: (race: RaceDTO) => void;
  onDelete: (race: RaceDTO) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dato</TableHead>
          <TableHead>Tid</TableHead>
          <TableHead>Vær</TableHead>
          {expandable && <TableHead className="text-right">Løpere</TableHead>}
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((race) => {
          const isExpanded = expandedRaceUuid === race.uuid;
          return (
            <Fragment key={race.uuid}>
              <TableRow
                className={expandable ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={expandable ? () => onToggleExpand(race) : undefined}
              >
                <TableCell className="flex items-center gap-2">
                  {race.isPublished ? (
                    <CheckCircle2Icon className="size-3.5 shrink-0 text-green-600" />
                  ) : (
                    <CircleDashedIcon className="size-3.5 shrink-0 text-red-600" />
                  )}
                  <span className="font-medium">
                    {formatDDMonth(race.raceDate)}
                  </span>
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatTimeStamp(race.raceDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {race.weather || race.courseCondition ? (
                    <WeatherLine
                      weather={race.weather}
                      courseCondition={race.courseCondition}
                      className="text-xs"
                    />
                  ) : (
                    <span className="italic text-xs">Ikke registrert</span>
                  )}
                </TableCell>
                {expandable && (
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {race.runnerCount ?? "–"}
                  </TableCell>
                )}
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="size-7 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(race);
                      }}
                    >
                      <PencilIcon className="size-3.5" />
                    </Button>
                    <DeleteButton
                      stopPropagation
                      onClick={() => onDelete(race)}
                    />
                  </div>
                </TableCell>
              </TableRow>
              {expandable && isExpanded && (
                <ExpandedTableRow raceUuid={race.uuid} />
              )}
            </Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
}

const Shell = ({ children }: { children: ReactNode }) => (
  <TableRow className="bg-muted/30 hover:bg-muted/30">
    <TableCell colSpan={5} className="py-2 px-4">
      {children}
    </TableCell>
  </TableRow>
);

const ExpandedTableRow = ({ raceUuid }: { raceUuid: string }) => {
  const {
    data: runners,
    isPending,
    isError,
  } = useQuery(QUERIES.race.getAllRunnersInRace(raceUuid));

  if (isPending) {
    return (
      <Shell>
        <p className="flex items-center gap-2 text-xs text-muted-foreground italic py-2 px-3">
          <Loader2Icon className="size-3.5 animate-spin" />
          Laster løpere...
        </p>
      </Shell>
    );
  }

  if (isError) {
    return (
      <Shell>
        <p className="text-xs text-destructive py-2 px-3">
          Kunne ikke laste løpere.
        </p>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="divide-y rounded-md border bg-background">
        {runners.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-2 px-3">
            Ingen løpere registrert.
          </p>
        ) : (
          runners.map((rr, i) => (
            <div
              key={rr.runner.uuid}
              className="flex items-center justify-between px-3 py-1.5 text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs tabular-nums text-muted-foreground w-5 text-right">
                  {i + 1}.
                </span>
                <span className="font-medium">{rr.runner.name}</span>
              </div>
              <span className="tabular-nums font-mono text-xs text-muted-foreground">
                {rr.hideTime
                  ? "Kun deltatt"
                  : formatSecondsToTime(
                      mapResultTimeToNumber(String(rr.resultTime)),
                    )}
              </span>
            </div>
          ))
        )}
      </div>
    </Shell>
  );
};
