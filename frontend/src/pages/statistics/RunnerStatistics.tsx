import { useQuery, useQueryClient } from "@tanstack/react-query";
import { UserSearch } from "lucide-react";
import { lazy, Suspense, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import RunnerSearchBox from "@/components/RunnerSearchBox.tsx";
import { RunnerProfileCard } from "@/components/Statistics/RunnerProfileCard.tsx";
import RunnerRaceResults from "@/components/Statistics/RunnerRaceResults.tsx";
import { RunnerSeasonSummary } from "@/components/Statistics/RunnerSeasonSummary.tsx";
import { StickySeasonBar } from "@/components/Statistics/StickySeasonBar.tsx";
import { TopParticipantsList } from "@/components/Statistics/TopParticipantsList.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import { YearSelector, type YearValue } from "@/components/YearSelector.tsx";
import { runnerStatisticsPath } from "@/lib/constants.ts";
import {
  getAverageTime,
  getBestTimeThisYear,
  getPersonalRecord,
} from "@/lib/statisticsUtils.ts";
import { extractYear, raceDateToSortKey } from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";

const RunnerTimeChart = lazy(
  () => import("@/components/Statistics/RunnerTimeChart.tsx"),
);

const EMPTY_RACE_HISTORY: RaceRunnerDTO[] = [];

export function RunnerStatistics() {
  const { uuid } = useParams<{ uuid: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: runner,
    isError,
    isPlaceholderData,
  } = useQuery({
    ...QUERIES.runner.getRunnerByUuid(uuid ?? ""),
    enabled: !!uuid,
  });

  if (uuid && isError) {
    throw new Response("Fant ikke løperen", { status: 404 });
  }

  const openRunner = (selected: RunnerDTO) => {
    queryClient.setQueryData(
      QUERIES.runner.getRunnerByUuid(selected.uuid).queryKey,
      selected,
    );
    navigate(runnerStatisticsPath(selected.uuid));
  };

  const currentRunner = uuid && !isPlaceholderData ? runner : undefined;

  return (
    <div className="flex flex-col gap-4">
      <RunnerSearchBox
        onSelect={openRunner}
        selectedName={currentRunner?.name}
      />
      {!uuid && <RunnerSearchLanding />}
      {currentRunner && (
        <RunnerProfile key={currentRunner.uuid} runner={currentRunner} />
      )}
    </div>
  );
}

function RunnerSearchLanding() {
  const { data: races } = useQuery(QUERIES.race.getAllRaceInfos());
  const latestYear = useMemo(() => getYears(races ?? [])[0], [races]);
  const { data: yearStatistics } = useQuery({
    ...QUERIES.statistics.race(latestYear),
    enabled: latestYear != null,
  });

  return (
    <>
      <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed px-6 py-8 text-center">
        <div className="grid size-11 place-items-center rounded-full bg-secondary text-secondary-foreground">
          <UserSearch className="size-5" />
        </div>
        <p className="font-display text-base font-extrabold tracking-tight">
          Finn en løper
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Søk etter navn for å se pers, sesongbeste og utvikling over tid.
        </p>
      </div>
      {yearStatistics && (
        <TopParticipantsList
          title="Mest aktive løpere"
          subtitle={`Flest løp i ${latestYear}`}
          participants={yearStatistics.topParticipants}
        />
      )}
    </>
  );
}

function RunnerProfile({ runner }: { runner: RunnerDTO }) {
  const [season, setSeason] = useState<YearValue>("all");
  const seasonSectionRef = useRef<HTMLElement>(null);

  const { data, isPending, isPlaceholderData } = useQuery(
    QUERIES.runner.getAllRacesByRunner(runner.uuid),
  );
  const isLoading = isPending || isPlaceholderData;
  const raceHistory = isLoading
    ? EMPTY_RACE_HISTORY
    : (data ?? EMPTY_RACE_HISTORY);

  const personalRecord = useMemo(
    () => getPersonalRecord(raceHistory, runner.historicPersonalRecord),
    [raceHistory, runner],
  );

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    for (const rr of raceHistory) {
      years.add(extractYear(rr.raceInfo.raceDate));
    }
    return Array.from(years).toSorted((a, b) => b - a);
  }, [raceHistory]);

  const seasonResults = useMemo(
    () =>
      season === "all"
        ? EMPTY_RACE_HISTORY
        : raceHistory
            .filter((rr) => extractYear(rr.raceInfo.raceDate) === season)
            .toSorted((a, b) =>
              raceDateToSortKey(b.raceInfo.raceDate).localeCompare(
                raceDateToSortKey(a.raceInfo.raceDate),
              ),
            ),
    [raceHistory, season],
  );

  const selectSeasonAndScroll = (year: number) => {
    setSeason(year);
    seasonSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <>
      <RunnerProfileCard
        runner={runner}
        personalRecord={personalRecord}
        totalRaces={raceHistory.length}
        seasons={availableYears.length}
        isLoading={isLoading}
      />

      {!isLoading && availableYears.length === 0 && (
        <p className="rounded-2xl border bg-card px-6 py-8 text-center text-sm text-muted-foreground">
          Ingen registrerte løp siden 2019.
        </p>
      )}

      {availableYears.length > 0 && (
        <section
          ref={seasonSectionRef}
          className="flex scroll-mt-14 flex-col gap-3 md:scroll-mt-17.5"
        >
          <StickySeasonBar
            title={season === "all" ? "Alle sesonger" : `Sesongen ${season}`}
          >
            <YearSelector
              includeAll
              years={availableYears}
              value={season}
              onChange={setSeason}
            />
          </StickySeasonBar>

          {season !== "all" && (
            <div className="grid grid-cols-3 gap-2 md:gap-3">
              <StatTile value={seasonResults.length} label="Løp" />
              <StatTile
                value={getBestTimeThisYear(raceHistory, season)}
                label="Sesongbeste"
                tone="primary"
              />
              <StatTile value={getAverageTime(seasonResults)} label="Snittid" />
            </div>
          )}

          <div className="flex flex-col gap-3 *:min-w-0">
            <Suspense fallback={null}>
              <RunnerTimeChart
                raceHistory={raceHistory}
                availableYears={availableYears}
                season={season}
              />
            </Suspense>

            {season === "all" ? (
              <RunnerSeasonSummary
                raceHistory={raceHistory}
                availableYears={availableYears}
                onSelectYear={selectSeasonAndScroll}
              />
            ) : (
              <RunnerRaceResults
                year={season}
                results={seasonResults}
                raceHistory={raceHistory}
                personalRecord={personalRecord}
                seasonBest={getBestTimeThisYear(raceHistory, season)}
              />
            )}
          </div>
        </section>
      )}
    </>
  );
}
