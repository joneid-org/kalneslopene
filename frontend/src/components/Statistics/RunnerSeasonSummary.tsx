import { ChevronRight } from "lucide-react";
import { StatCard } from "@/components/Statistics/StatCard.tsx";
import { getBestTimeThisYear } from "@/lib/statisticsUtils.ts";
import { extractYear } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  raceHistory: RaceRunnerDTO[];
  availableYears: number[];
  onSelectYear: (year: number) => void;
};

export function RunnerSeasonSummary({
  raceHistory,
  availableYears,
  onSelectYear,
}: Props) {
  if (availableYears.length === 0) return null;

  return (
    <StatCard title="Sesong for sesong" subtitle="Trykk på et år for detaljer">
      <ul className="-mx-2 flex flex-col">
        {availableYears.map((year) => {
          const races = raceHistory.filter(
            (rr) => extractYear(rr.raceInfo.raceDate) === year,
          ).length;
          return (
            <li key={year}>
              <button
                type="button"
                onClick={() => onSelectYear(year)}
                className="flex w-full items-center gap-3 rounded-xl px-2 py-2.5 text-left transition-colors hover:bg-accent"
              >
                <span className="w-12 font-display text-[15px] font-extrabold tabular-nums">
                  {year}
                </span>
                <span className="flex-1 text-sm text-muted-foreground tabular-nums">
                  {races} løp
                </span>
                <span className="text-right">
                  <span className="block text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Sesongbeste
                  </span>
                  <span className="font-display text-[15px] font-bold tabular-nums">
                    {getBestTimeThisYear(raceHistory, year)}
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </button>
            </li>
          );
        })}
      </ul>
    </StatCard>
  );
}
