import { History } from "lucide-react";
import type { RaceStatisticsDTO, RunnerOverviewStatsDTO } from "@/model/DTO.ts";

type Props = {
  statistics?: RaceStatisticsDTO;
  runnerOverview?: RunnerOverviewStatsDTO;
};

function AllTimeStat({
  value,
  label,
}: {
  value: number | undefined;
  label: string;
}) {
  return (
    <div className="flex flex-col justify-center px-3 py-3 md:px-4">
      {value == null ? (
        <div className="h-7 w-14 animate-pulse rounded bg-muted" />
      ) : (
        <div className="font-display text-2xl font-extrabold leading-none tabular-nums text-primary md:text-[28px]">
          {value.toLocaleString("nb-NO")}
        </div>
      )}
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function AllTimeStatsCard({ statistics, runnerOverview }: Props) {
  const firstYear = runnerOverview?.firstRaceYear;

  return (
    <div className="flex flex-col rounded-2xl border bg-card p-4 md:p-5">
      <div className="mb-2 flex items-center gap-2.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-secondary text-secondary-foreground">
          <History className="size-4" />
        </div>
        <h2 className="font-display text-base font-extrabold tracking-tight">
          Gjennom tidene
        </h2>
      </div>
      <div className="grid flex-1 grid-cols-2 [&>*:nth-child(-n+2)]:border-b [&>*:nth-child(odd)]:border-r">
        <AllTimeStat
          value={runnerOverview?.totalRunners}
          label="Unike løpere siden 1978"
        />
        <AllTimeStat
          value={runnerOverview?.runnersInRaces}
          label={firstYear ? `Unike løpere siden ${firstYear}` : "Unike løpere"}
        />
        <AllTimeStat
          value={statistics?.completedRaces}
          label={
            firstYear ? `Løp arrangert siden ${firstYear}` : "Løp arrangert"
          }
        />
        <AllTimeStat
          value={
            statistics &&
            statistics.totalParticipations.male +
              statistics.totalParticipations.female
          }
          label={firstYear ? `Deltakelser siden ${firstYear}` : "Deltakelser"}
        />
      </div>
    </div>
  );
}
