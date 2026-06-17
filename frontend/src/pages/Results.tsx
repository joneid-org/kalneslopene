import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { RacePhotoGrid } from "@/components/Results/RacePhotoGrid.tsx";
import { RaceSwitcher } from "@/components/Results/RaceSwitcher.tsx";
import ResultsHeader from "@/components/Results/ResultsHeader.tsx";
import ResultsTable from "@/components/Results/ResultsTable.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import {
  getNewPersonalBestCount,
  getNewYearBestCount,
} from "@/lib/statisticsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import {
  buildTableRows,
  getMostRecentRace,
  getNextRace,
  getPreviousRace,
} from "@/lib/utils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

export function Results() {
  const { uuid = "" } = useParams<{ uuid: string }>();

  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const { data: raceRunners } = useQuery(
    QUERIES.race.getAllRunnersInRace(uuid),
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const runnerRaceQueries = useQueries({
    queries: (raceRunners ?? []).map((rr) =>
      QUERIES.runner.getAllRacesByRunner(rr.runner.uuid ?? ""),
    ),
  });

  const { raceCountByRunner, allRacesByRunner } = useMemo(() => {
    const count: Record<string, number> = {};
    const all: Record<string, RaceRunnerDTO[]> = {};
    (raceRunners ?? []).forEach((rr, index) => {
      const id = rr.runner.uuid ?? "";
      count[id] = runnerRaceQueries[index]?.data?.length ?? 0;
      all[id] = runnerRaceQueries[index]?.data ?? [];
    });
    return { raceCountByRunner: count, allRacesByRunner: all };
  }, [raceRunners, runnerRaceQueries]);

  const allRaces = races ?? [];
  const race = allRaces.find((r) => r.uuid === uuid);
  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const title = formatDateFull(race?.raceDate);
  const tableData = buildTableRows(
    raceRunners ?? [],
    raceCountByRunner,
    allRacesByRunner,
  );
  const participants = raceRunners?.length;
  const maleCount = raceRunners?.filter(
    (r) => r.runner.gender === "Mann",
  ).length;
  const femaleCount = raceRunners?.filter(
    (r) => r.runner.gender === "Kvinne",
  ).length;
  const yearBestCount = getNewYearBestCount(
    raceRunners ?? [],
    uuid,
    allRacesByRunner,
  );
  const personalBestCount = getNewPersonalBestCount(
    raceRunners ?? [],
    uuid,
    allRacesByRunner,
  );
  const debutantCount = Object.values(raceCountByRunner).filter(
    (c) => c === 1,
  ).length;
  const racePhotos = race?.photos ?? [];

  if (!race) {
    const latest = getMostRecentRace(allRaces);
    if (!uuid && latest) {
      return <Navigate to={`/Resultater/${latest.uuid}`} replace />;
    }
    return null;
  }

  return (
    <div className="page-content flex flex-col gap-4 md:gap-6">
      <RaceSwitcher
        race={race}
        previousRace={previous}
        nextRace={next}
        path="/Resultater/"
      />

      <ResultsHeader race={race} title={title} />

      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        <StatTile value={participants} label="Deltakere" />
        <StatTile value={maleCount} label="Menn" />
        <StatTile value={femaleCount} label="Kvinner" />
        <StatTile value={yearBestCount} label="Årsbeste" tone="primary" />
        <StatTile
          value={personalBestCount}
          label="Personlig rek."
          tone="primary"
        />
        <StatTile value={debutantCount} label="Debutanter" tone="brand" />
      </div>

      <ResultsTable tableData={tableData} />

      <RacePhotoGrid
        photos={racePhotos}
        uuid={uuid}
        onPhotoClick={setLightboxIndex}
      />
      <PhotoDialog
        photos={racePhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
