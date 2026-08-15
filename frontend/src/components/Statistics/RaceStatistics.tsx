import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { AttendanceChart } from "@/components/Statistics/AttendanceChart.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import { YearSelector } from "@/components/YearSelector.tsx";
import { getFastestRunner } from "@/lib/statisticsUtils.ts";
import {
  endOfYearString,
  formatSecondsToTime,
  mapResultTimeToNumber,
  startOfYearString,
} from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";

export default function RaceStatistics() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const { data: races } = useQuery(QUERIES.race.getAllRaceInfos());
  const { data: allTimeStatistics } = useQuery(QUERIES.statistics.race());
  const { data: runnerOverview, isPending: isPendingOverview } = useQuery(
    QUERIES.statistics.runnerOverview(),
  );

  const availableYears = useMemo(() => getYears(races ?? []), [races]);
  const effectiveYear = selectedYear ?? availableYears[0];

  const { data: yearStatistics, isPending: isPendingYearStatistics } = useQuery(
    {
      ...QUERIES.statistics.race(effectiveYear),
      enabled: effectiveYear != null,
    },
  );

  const { data: yearRacesData } = useQuery({
    ...QUERIES.race.getRaces({
      filter: {
        from: startOfYearString(effectiveYear),
        to: endOfYearString(effectiveYear),
        isPublished: true,
      },
      pageSize: null,
    }),
    enabled: effectiveYear != null,
  });
  const yearRaces = yearRacesData?.content ?? [];

  const recordMale = allTimeStatistics?.courseRecordMale;
  const recordFemale = allTimeStatistics?.courseRecordFemale;

  const yearFastest = getFastestRunner(
    [
      yearStatistics?.courseRecordMale,
      yearStatistics?.courseRecordFemale,
    ].filter((rr) => rr != null),
  );

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
        Løpsstatistikk
      </h2>

      {(recordMale || recordFemale) && (
        <div className="flex items-center gap-4 rounded-2xl bg-brand-ink p-4 text-white md:p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-brand text-brand-foreground md:size-12">
            <Trophy className="size-5 md:size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              Løyperekord
            </div>
            <div className="mt-1 flex flex-col gap-1">
              {recordMale && (
                <div className="truncate">
                  <span className="font-display text-lg font-extrabold tabular-nums md:text-xl">
                    {formatSecondsToTime(
                      mapResultTimeToNumber(recordMale.resultTime),
                    )}
                  </span>
                  <span className="text-sm">
                    {" "}
                    — {recordMale.runner.name} - menn
                  </span>
                </div>
              )}
              {recordFemale && (
                <div className="truncate">
                  <span className="font-display text-lg font-extrabold tabular-nums md:text-xl">
                    {formatSecondsToTime(
                      mapResultTimeToNumber(recordFemale.resultTime),
                    )}
                  </span>
                  <span className="text-sm">
                    {" "}
                    — {recordFemale.runner.name} - kvinner
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 md:gap-3">
        <StatTile
          value={runnerOverview?.totalRunners}
          label="Unike løpere siden 1978"
          tone="primary"
          isLoading={isPendingOverview}
        />
        <StatTile
          value={runnerOverview?.runnersInRaces}
          label={
            runnerOverview?.firstRaceYear
              ? `Unike løpere siden ${runnerOverview.firstRaceYear}`
              : "Unike løpere"
          }
          tone="primary"
          isLoading={isPendingOverview}
        />
      </div>

      {availableYears.length > 0 && (
        <div className="py-0.5">
          <YearSelector
            years={availableYears}
            value={effectiveYear}
            onChange={(v) => setSelectedYear(v === "all" ? undefined : v)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 md:gap-3 xl:grid-cols-4">
        <StatTile
          value={
            yearStatistics != null
              ? yearStatistics.totalParticipations.female +
                yearStatistics.totalParticipations.male
              : undefined
          }
          label="Løpsdeltakelser"
          isLoading={isPendingYearStatistics}
        />
        <StatTile
          value={yearStatistics?.uniqueRunners.total}
          label="Unike løpere"
          isLoading={isPendingYearStatistics}
        />
        <StatTile
          value={
            yearStatistics?.averageRunnersPerRace != null
              ? Math.round(yearStatistics.averageRunnersPerRace)
              : undefined
          }
          label="Snittdeltakelse"
          isLoading={isPendingYearStatistics}
        />
        <StatTile
          value={formatSecondsToTime(
            mapResultTimeToNumber(yearFastest?.resultTime),
          )}
          label="Raskeste tid"
          tone="primary"
          isLoading={isPendingYearStatistics}
        />
      </div>

      <div>
        <AttendanceChart races={yearRaces} />
      </div>
    </section>
  );
}
