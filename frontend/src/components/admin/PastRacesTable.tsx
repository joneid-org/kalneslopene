import { CheckCircle2Icon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  formatTimeStamp,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function PastRacesTable({
  rows,
  expandable,
  expandedRaceUuid,
  runnerCountByRace,
  runnersForRace,
  onToggleExpand,
  onEdit,
  onDelete,
}: {
  rows: RaceDTO[];
  expandable: boolean;
  expandedRaceUuid: string | null;
  runnerCountByRace: Map<string, number>;
  runnersForRace: (race: RaceDTO) => RaceRunnerDTO[];
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
          const runners = runnersForRace(race);
          return (
            <>
              <TableRow
                key={race.uuid}
                className={expandable ? "cursor-pointer hover:bg-muted/50" : ""}
                onClick={expandable ? () => onToggleExpand(race) : undefined}
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle2Icon className="size-3.5 text-green-600 shrink-0" />
                    <span className="font-medium">
                      {formatDDMonth(race.raceDate)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="tabular-nums text-muted-foreground">
                  {formatTimeStamp(race.raceDate)}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {race.weather ?? (
                    <span className="italic text-xs">Ikke registrert</span>
                  )}
                </TableCell>
                {expandable && (
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {runnerCountByRace.get(race.uuid ?? "") ?? "–"}
                  </TableCell>
                )}
                <TableCell>
                  {/* biome-ignore lint/a11y/noStaticElementInteractions: stop row click propagation */}
                  {/* biome-ignore lint/a11y/useKeyWithClickEvents: stop row click propagation */}
                  <div
                    className="flex items-center gap-1 justify-end"
                    onClick={(e) => e.stopPropagation()}
                  >
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
              </TableRow>
              {expandable && isExpanded && (
                <TableRow
                  key={`${race.uuid}-expanded`}
                  className="bg-muted/30 hover:bg-muted/30"
                >
                  <TableCell colSpan={5} className="py-2 px-4">
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
                              <span className="font-medium">
                                {rr.runner.name}
                              </span>
                            </div>
                            <span className="tabular-nums font-mono text-xs text-muted-foreground">
                              {rr.hideTime
                                ? "Kun deltatt"
                                : formatSecondsToTime(
                                    mapResultTimeToNumber(
                                      String(rr.resultTime),
                                    ),
                                  )}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          );
        })}
      </TableBody>
    </Table>
  );
}
