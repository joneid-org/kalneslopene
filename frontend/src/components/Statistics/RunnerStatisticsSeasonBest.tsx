import { cn, getBestRaceThisYearFromRunner } from "@/lib/utils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  availableYears: number[];
  raceHistory: RaceRunnerDTO[];
};

export default function RunnerStatisticsSeasonBest({
  availableYears,
  raceHistory,
}: Props) {
  if (availableYears.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card px-5">
      <ul className="divide-y divide-border">
        {availableYears.map((year, idx) => (
          <li key={year} className="flex items-center justify-between py-3.5">
            <span
              className={cn(
                "text-sm",
                idx === 0 ? "font-bold text-primary" : "font-semibold",
              )}
            >
              Sesongbeste {year}
            </span>
            <span
              className={cn(
                "font-display text-[17px] tabular-nums",
                idx === 0 ? "font-extrabold" : "font-bold",
              )}
            >
              {getBestRaceThisYearFromRunner(raceHistory, year)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
