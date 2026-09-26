import { StatCard } from "@/components/Statistics/StatCard.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  year: number;
  results: RaceRunnerDTO[];
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
  personalRecord,
  seasonBest,
}: Props) {
  return (
    <StatCard title={`Resultater ${year}`}>
      {results.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          Ingen resultater for valgt sesong.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {results.map((rr) => {
            const label = resultLabel(rr);
            return (
              <li
                key={rr.raceInfo.uuid}
                className="flex items-center gap-2 py-3"
              >
                <span className="flex-1 text-sm tabular-nums text-foreground">
                  {formatDDMonth(rr.raceInfo.raceDate)}
                </span>
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
