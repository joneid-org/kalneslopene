import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import RaceStatistics from "@/components/Statistics/RaceStatistics.tsx";
import RunnerStatistics from "@/components/Statistics/RunnerStatistics.tsx";

export function Statistics() {
  const { data: runnerOverview } = useQuery(
    QUERIES.statistics.runnerOverview(),
  );
  const firstRaceYear = runnerOverview?.firstRaceYear;

  return (
    <div className="page-content">
      {firstRaceYear && (
        <p className={"mb-6 text-center text-xs text-muted-foreground"}>
          Vi har bare resultater fra {firstRaceYear}, og statistikken vil derfor
          ikke telle med løp før {firstRaceYear}
        </p>
      )}
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_1.3fr] md:items-start md:gap-6 *:min-w-0">
        <RaceStatistics />
        <RunnerStatistics />
      </div>
    </div>
  );
}
