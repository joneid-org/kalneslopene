import { useState } from "react";
import { YearSelector } from "@/components/YearSelector.tsx";
import {
  extractYear,
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = { raceHistory: RaceRunnerDTO[]; availableYears: number[] };

function resultLabel(rr: RaceRunnerDTO): string {
  if (rr.hideTime) return "Deltatt";
  if (!rr.resultTime) return "–";
  return formatSecondsToTime(mapResultTimeToNumber(rr.resultTime));
}

export default function RunnerRaceResults({
  raceHistory,
  availableYears,
}: Props) {
  const [selectedYear, setSelectedYear] = useState<number>(
    availableYears[0] ?? 0,
  );

  if (availableYears.length === 0) return null;

  const results = raceHistory
    .filter((rr) => extractYear(rr.raceInfo.raceDate) === selectedYear)
    .toSorted((a, b) =>
      raceDateToSortKey(b.raceInfo.raceDate).localeCompare(
        raceDateToSortKey(a.raceInfo.raceDate),
      ),
    );

  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-bold">Alle resultater</span>
        <YearSelector
          tone="primary"
          years={availableYears}
          value={selectedYear}
          onChange={(v) => v !== "all" && setSelectedYear(v)}
        />
      </div>

      {results.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Ingen resultater for valgt sesong.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {results.map((rr) => (
            <li
              key={rr.raceInfo.uuid}
              className="flex items-center justify-between py-3"
            >
              <span className="text-sm tabular-nums text-foreground">
                {formatDDMonth(rr.raceInfo.raceDate)}
              </span>
              <span className="font-display text-[15px] font-bold tabular-nums">
                {resultLabel(rr)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
