import { useState } from "react";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
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
  const [range, setRange] = useState<string>(
    availableYears.length > 0 ? String(availableYears[0]) : "all",
  );

  if (availableYears.length === 0) return null;

  const options = availableYears.map((y) => ({
    label: String(y),
    value: String(y),
  }));

  const selectedYear = Number.parseInt(range, 10);

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
        <SegmentedControl
          tone="primary"
          options={options}
          value={range}
          onChange={setRange}
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
