import { useQuery } from "@tanstack/react-query";
import { ActivityIcon, TimerIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import RunnerStatisticsHeader from "@/components/RunnerStatisticsHeader.tsx";
import RunnerStatisticsRaceHistory from "@/components/RunnerStatisticsRaceHistory.tsx";
import RunnerStatisticsSeasonBest from "@/components/RunnerStatisticsSeasonBest.tsx";
import RunnerTimeChart from "@/components/RunnerTimeChart.tsx";
import SearchBox from "@/components/SearchBox.tsx";
import StatBox from "@/components/StatBox.tsx";
import { extractYear } from "@/lib/timeUtils.ts";
import { getBestRaceFromRunner } from "@/lib/utils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

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

  const availableYears = useMemo(
    () =>
      Array.from(
        new Set((raceHistory ?? []).map((rr) => extractYear(rr.race.raceDate))),
      ).sort((a, b) => b - a),
    [raceHistory],
  );

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
              color="blue"
            />
            <StatBox
              icon={TimerIcon}
              value={pr}
              label="Personlig rekord"
              color="green"
            />
          </div>

          <RunnerTimeChart
            raceHistory={raceHistory ?? []}
            availableYears={availableYears}
          />

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
