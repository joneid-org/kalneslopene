import { useQueries, useQuery } from "@tanstack/react-query";
import {
  ActivityIcon,
  CalendarIcon,
  FilterIcon,
  TimerIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import StatBox from "@/components/StatBox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  getAverageParticipants,
  getCourseRecord,
  getMaxParticipantsInSingleRace,
  getNumberOfRaces,
  getNumberOfUniqueRunners,
  getNumberOfUniqueRunnersThisYear,
} from "@/lib/statisticsUtils.ts";
import { extractYear, formatDateFull } from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

export default function RaceStatistics() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const runnerQueries = useQueries({
    queries: (races ?? []).map((race) =>
      QUERIES.race.getAllRunnersInRace(race.uuid ?? ""),
    ),
  });

  const allRaceRunners = useMemo(
    () => runnerQueries.flatMap((q) => (q.data ?? []) as RaceRunnerDTO[]),
    [runnerQueries],
  );

  const availableYears = useMemo(() => getYears(races ?? []), [races]);

  const filtered = useMemo(
    () =>
      selectedYear
        ? allRaceRunners.filter(
            (rr) => extractYear(rr.race.raceDate) === selectedYear,
          )
        : allRaceRunners,
    [allRaceRunners, selectedYear],
  );

  const filteredRaces = useMemo(
    () =>
      selectedYear
        ? (races ?? []).filter((r) => extractYear(r.raceDate) === selectedYear)
        : (races ?? []),
    [races, selectedYear],
  );

  const totalRaces = getNumberOfRaces(filteredRaces);
  const totalUniqueRunners = selectedYear
    ? getNumberOfUniqueRunnersThisYear(allRaceRunners, selectedYear)
    : getNumberOfUniqueRunners(allRaceRunners);
  const totalFinishes = filtered.length;
  const highestParticipation = getMaxParticipantsInSingleRace(filtered);
  const averageParticipation = getAverageParticipants(filtered);
  const courseRecord = getCourseRecord(filtered);

  const allTimeRecord = useMemo(
    () => getCourseRecord(allRaceRunners),
    [allRaceRunners],
  );

  const allTimeBest = useMemo(
    () =>
      allRaceRunners
        .filter((rr) => !rr.hideTime && rr.resultTime)
        .sort((a, b) => a.resultTime.localeCompare(b.resultTime))[0] ?? null,
    [allRaceRunners],
  );

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold">Løpsstatistikk</h2>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={selectedYear === undefined ? "default" : "outline"}
            onClick={() => setSelectedYear(undefined)}
          >
            Alle år
          </Button>
          {availableYears.map((y) => (
            <Button
              key={y}
              size="sm"
              variant={selectedYear === y ? "default" : "outline"}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox
          icon={CalendarIcon}
          value={totalRaces}
          label="Arrangerte løp"
          color="blue"
        />
        <StatBox
          icon={UsersIcon}
          value={totalUniqueRunners}
          label="Unike løpere"
          color="green"
        />
        <StatBox
          icon={ActivityIcon}
          value={totalFinishes}
          label="Løpere har fullført"
          color="orange"
        />
        <StatBox
          icon={UsersIcon}
          value={highestParticipation}
          label="Deltakerrekord"
          color="orange"
        />
        <StatBox
          icon={FilterIcon}
          value={averageParticipation}
          label="Snitt deltakere"
          color="blue"
        />
        <StatBox
          icon={TimerIcon}
          value={courseRecord}
          label="Årets raskeste tid"
          color="green"
        />
      </div>

      {allTimeBest && (
        <Card className="bg-muted/30">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <TrophyIcon className="size-4 text-amber-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground font-medium">
                Løyperekord
              </span>
              <p className="text-sm">
                <span className="font-semibold">{allTimeRecord}</span>
                {" — "}
                {allTimeBest.runner.name}
                <span className="text-muted-foreground">
                  {", "}
                  {formatDateFull(allTimeBest.race.raceDate)}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
