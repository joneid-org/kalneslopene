import { useMemo } from "react";
import { StatCard } from "@/components/Statistics/StatCard.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  year: number;
  results: RaceRunnerDTO[];
  raceHistory: RaceRunnerDTO[];
  personalRecord: string;
  seasonBest: string;
};

function resultLabel(rr: RaceRunnerDTO): string {
  if (rr.hideTime) return "Deltatt";
  if (!rr.resultTime) return "–";
  return formatSecondsToTime(mapResultTimeToNumber(rr.resultTime));
}

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-foreground">
      {children}
    </span>
  );
}

export default function RunnerRaceResults({
  year,
  results,
  raceHistory,
  personalRecord,
  seasonBest,
}: Props) {
  const totalRaceNumbers = useMemo(
    () =>
      new Map(
        raceHistory
          .toSorted((a, b) =>
            raceDateToSortKey(a.raceInfo.raceDate).localeCompare(
              raceDateToSortKey(b.raceInfo.raceDate),
            ),
          )
          .map((rr, i) => [rr.raceInfo.uuid, i + 1]),
      ),
    [raceHistory],
  );

  return (
    <StatCard title={`Resultater ${year}`}>
      {results.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Ingen resultater for valgt sesong.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {results.map((rr, i) => {
            const label = resultLabel(rr);
            return (
              <li
                key={rr.raceInfo.uuid}
                className="flex items-center gap-2 py-3"
              >
                <div className="flex flex-1 flex-col">
                  <span className="text-sm tabular-nums text-foreground">
                    {formatDDMonth(rr.raceInfo.raceDate)}
                  </span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {results.length - i}. løp i sesongen ·{" "}
                    {totalRaceNumbers.get(rr.raceInfo.uuid)}. totalt
                  </span>
                </div>
                {label === personalRecord ? (
                  <Badge>Pers</Badge>
                ) : (
                  label === seasonBest && <Badge>SB</Badge>
                )}
                <span className="font-display text-[15px] font-bold tabular-nums">
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </StatCard>
  );
}
