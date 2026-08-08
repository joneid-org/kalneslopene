import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import RunnerSearchBox from "@/components/RunnerSearchBox.tsx";
import RunnerRaceResults from "@/components/Statistics/RunnerRaceResults.tsx";
import RunnerStatisticsHeader from "@/components/Statistics/RunnerStatisticsHeader.tsx";
import RunnerStatisticsSeasonBest from "@/components/Statistics/RunnerStatisticsSeasonBest.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import { getBestRaceFromRunner } from "@/lib/utils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";

const RunnerTimeChart = lazy(
  () => import("@/components/Statistics/RunnerTimeChart.tsx"),
);

const EMPTY_RACE_HISTORY: RaceRunnerDTO[] = [];

export default function RunnerStatistics() {
  const [selectedRunner, setSelectedRunner] = useState<RunnerDTO | null>(null);

  const { data, isPending } = useQuery({
    ...QUERIES.runner.getAllRacesByRunner(selectedRunner?.uuid ?? ""),
    enabled: !!selectedRunner?.uuid,
  });
  const raceHistory = data ?? EMPTY_RACE_HISTORY;

  const totalRaces = raceHistory.length;

  const pr = useMemo(() => {
    const bestRace = getBestRaceFromRunner(raceHistory);
    if (bestRace !== "-") return bestRace;
    return formatSecondsToTime(
      mapResultTimeToNumber(selectedRunner?.historicPersonalRecord),
    );
  }, [raceHistory, selectedRunner]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const rr of raceHistory) {
      years.add(extractYear(rr.raceInfo.raceDate));
    }
    return Array.from(years).toSorted((a, b) => b - a);
  }, [raceHistory]);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
        Løperstatistikk
      </h2>

      <RunnerSearchBox onSelect={setSelectedRunner} />

      {selectedRunner && (
        <div className="flex flex-col gap-3">
          <RunnerStatisticsHeader runner={selectedRunner} />

          <div className="grid grid-cols-2 gap-3">
            <StatTile
              value={totalRaces}
              label="Løp fullført"
              isLoading={isPending}
            />
            <StatTile
              value={pr}
              label="Personlig rekord"
              tone="primary"
              isLoading={isPending}
            />
          </div>

          <Suspense fallback={null}>
            <RunnerTimeChart
              key={availableYears.join(",")}
              raceHistory={raceHistory}
              availableYears={availableYears}
            />
          </Suspense>

          <RunnerStatisticsSeasonBest
            availableYears={availableYears}
            raceHistory={raceHistory}
          />

          <RunnerRaceResults
            key={availableYears.join(",")}
            availableYears={availableYears}
            raceHistory={raceHistory}
          />
        </div>
      )}
    </section>
  );
}
