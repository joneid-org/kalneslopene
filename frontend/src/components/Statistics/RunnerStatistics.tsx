import { useQuery } from "@tanstack/react-query";
import { lazy, Suspense, useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import RunnerStatisticsHeader from "@/components/Statistics/RunnerStatisticsHeader.tsx";
import RunnerStatisticsSeasonBest from "@/components/Statistics/RunnerStatisticsSeasonBest.tsx";
import SearchBox from "@/components/Statistics/SearchBox.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import { withRaceDates } from "@/lib/statisticsUtils.ts";
import { extractYear } from "@/lib/timeUtils.ts";
import { getBestRaceFromRunner } from "@/lib/utils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

const RunnerTimeChart = lazy(
  () => import("@/components/Statistics/RunnerTimeChart.tsx"),
);

export default function RunnerStatistics() {
  const [selectedRunner, setSelectedRunner] = useState<RunnerDTO | null>(null);

  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const { data: raceHistory } = useQuery({
    ...QUERIES.runner.getAllRacesByRunner(selectedRunner?.uuid ?? ""),
    enabled: !!selectedRunner?.uuid,
  });

  const datedHistory = useMemo(
    () => withRaceDates(raceHistory ?? [], races ?? []),
    [raceHistory, races],
  );

  const totalRaces = raceHistory?.length ?? 0;

  const pr = useMemo(() => getBestRaceFromRunner(datedHistory), [datedHistory]);

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const rr of datedHistory) {
      years.add(extractYear(rr.raceDate));
    }
    return Array.from(years).toSorted((a, b) => b - a);
  }, [datedHistory]);

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
        Løperstatistikk
      </h2>

      <SearchBox onSelect={setSelectedRunner} />

      {selectedRunner && (
        <div className="flex flex-col gap-3">
          <RunnerStatisticsHeader runner={selectedRunner} />

          <div className="grid grid-cols-2 gap-3">
            <StatTile value={totalRaces} label="Løp fullført" />
            <StatTile value={pr} label="Personlig rekord" tone="primary" />
          </div>

          <Suspense fallback={null}>
            <RunnerTimeChart
              key={availableYears.join(",")}
              raceHistory={datedHistory}
              availableYears={availableYears}
            />
          </Suspense>

          <RunnerStatisticsSeasonBest
            availableYears={availableYears}
            raceHistory={datedHistory}
          />
        </div>
      )}
    </section>
  );
}
