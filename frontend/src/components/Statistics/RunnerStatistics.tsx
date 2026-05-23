import { useQuery } from "@tanstack/react-query";
import { ActivityIcon, TimerIcon } from "lucide-react";
import { lazy, Suspense, useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import StatBox from "@/components/StatBox.tsx";
import RunnerStatisticsHeader from "@/components/Statistics/RunnerStatisticsHeader.tsx";
import RunnerStatisticsRaceHistory from "@/components/Statistics/RunnerStatisticsRaceHistory.tsx";
import RunnerStatisticsSeasonBest from "@/components/Statistics/RunnerStatisticsSeasonBest.tsx";
import SearchBox from "@/components/Statistics/SearchBox.tsx";
import { extractYear } from "@/lib/timeUtils.ts";
import { getBestRaceFromRunner } from "@/lib/utils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

const RunnerTimeChart = lazy(
  () => import("@/components/Statistics/RunnerTimeChart.tsx"),
);

export default function RunnerStatistics() {
  const [selectedRunner, setSelectedRunner] = useState<RunnerDTO | null>(null);

  const { data: raceHistory } = useQuery({
    ...QUERIES.runner.getAllRacesByRunner(selectedRunner?.uuid ?? ""),
    enabled: !!selectedRunner?.uuid,
  });

  const totalRaces = raceHistory?.length ?? 0;

  const pr = useMemo(
    () => getBestRaceFromRunner(raceHistory ?? []),
    [raceHistory],
  );

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const rr of raceHistory ?? []) {
      years.add(extractYear(rr.race.raceDate));
    }
    return Array.from(years).toSorted((a, b) => b - a);
  }, [raceHistory]);

  return (
    <section className="space-y-4">
      <h2 className="font-semibold">Løperstatistikk</h2>

      <SearchBox onSelect={setSelectedRunner} />

      {selectedRunner && (
        <div className="space-y-4">
          <RunnerStatisticsHeader runner={selectedRunner} />

          <div className="grid grid-cols-2 gap-3">
            <StatBox
              icon={ActivityIcon}
              value={totalRaces}
              label="Løp fullført"
            />
            <StatBox icon={TimerIcon} value={pr} label="Personlig rekord" />
          </div>

          <Suspense fallback={null}>
            <RunnerTimeChart
              key={availableYears.join(",")}
              raceHistory={raceHistory ?? []}
              availableYears={availableYears}
            />
          </Suspense>

          <RunnerStatisticsSeasonBest
            availableYears={availableYears}
            raceHistory={raceHistory ?? []}
          />

          <RunnerStatisticsRaceHistory
            availableYears={availableYears}
            raceHistory={raceHistory ?? []}
          />
        </div>
      )}
    </section>
  );
}
