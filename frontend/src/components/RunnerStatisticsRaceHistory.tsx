import { ChevronLeftIcon, ChevronRightIcon, ListIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  availableYears: number[];
  raceHistory: RaceRunnerDTO[];
};

export default function RunnerStatisticsRaceHistory({
  availableYears,
  raceHistory,
}: Props) {
  const [yearIndex, setYearIndex] = useState(0);

  if (availableYears.length === 0) return null;

  const selectedYear = availableYears[yearIndex];

  const racesThisYear = raceHistory
    .filter((rr) => {
      const iso = raceDateToSortKey(rr.race.raceDate);
      return Number(iso.split("-")[0]) === selectedYear;
    })
    .sort((a, b) =>
      raceDateToSortKey(b.race.raceDate).localeCompare(
        raceDateToSortKey(a.race.raceDate),
      ),
    );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ListIcon className="size-4 text-primary" />
            Løpshistorikk
          </CardTitle>

          {/* Year pagination */}
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              disabled={yearIndex === 0}
              onClick={() => setYearIndex((i) => i - 1)}
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <span className="text-sm font-semibold w-12 text-center">
              {selectedYear}
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              disabled={yearIndex === availableYears.length - 1}
              onClick={() => setYearIndex((i) => i + 1)}
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {racesThisYear.map((rr, idx) => (
            <li
              key={`${rr.race.uuid ?? idx}`}
              className="flex items-center justify-between px-6 py-3"
            >
              <span className="text-sm text-muted-foreground">
                {formatDDMonth(rr.race.raceDate)}
              </span>
              <span className="tabular-nums text-sm font-mono font-semibold">
                {rr.hideTime
                  ? "Deltatt"
                  : formatSecondsToTime(mapResultTimeToNumber(rr.resultTime))}
              </span>
            </li>
          ))}
          {racesThisYear.length === 0 && (
            <li className="px-6 py-4 text-sm text-muted-foreground">
              Ingen løp registrert.
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
