import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { AttendanceChart } from "@/components/Statistics/AttendanceChart.tsx";
import { CourseRecordCard } from "@/components/Statistics/CourseRecordCard.tsx";
import { MonthlyParticipationList } from "@/components/Statistics/MonthlyParticipationList.tsx";
import { StickySeasonBar } from "@/components/Statistics/StickySeasonBar.tsx";
import { TopParticipantsList } from "@/components/Statistics/TopParticipantsList.tsx";
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

export function RaceStatistics() {
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

  const yearFastest = getFastestRunner(
    [
      yearStatistics?.courseRecordMale,
      yearStatistics?.courseRecordFemale,
    ].filter((rr) => rr != null),
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <section className="flex flex-col gap-2 md:grid md:grid-cols-[2fr_1fr_1fr] md:gap-3">
        <CourseRecordCard
          male={allTimeStatistics?.courseRecordMale}
          female={allTimeStatistics?.courseRecordFemale}
        />
        <div className="grid grid-cols-2 gap-2 md:contents">
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
      </section>

      {availableYears.length > 0 && (
        <section className="flex flex-col gap-3">
          <StickySeasonBar title={`Sesongen ${effectiveYear}`}>
            <YearSelector
              years={availableYears}
              value={effectiveYear}
              onChange={(v) => setSelectedYear(v === "all" ? undefined : v)}
            />
          </StickySeasonBar>

          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-3">
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

          <AttendanceChart races={yearRaces} />

          {yearStatistics && (
            <div className="grid gap-3 md:grid-cols-2 md:items-start">
              <MonthlyParticipationList statistics={yearStatistics} />
              <TopParticipantsList
                title="Flest løp"
                subtitle={`Topp 10 i ${effectiveYear}`}
                participants={yearStatistics.topParticipants}
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
