import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Navigate, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { RacePhotoGrid } from "@/components/Results/RacePhotoGrid.tsx";
import { RaceSwitcher } from "@/components/Results/RaceSwitcher.tsx";
import ResultsHeader from "@/components/Results/ResultsHeader.tsx";
import ResultsTable from "@/components/Results/ResultsTable.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";
import {
  buildTableRows,
  getMostRecentRace,
  getNextRace,
  getPreviousRace,
} from "@/lib/utils.ts";

export function Results() {
  const { uuid = "" } = useParams<{ uuid: string }>();

  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const { data: raceResults } = useQuery(
    QUERIES.race.getAllResultsInRace(uuid),
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allRaces = races ?? [];
  const race = allRaces.find((r) => r.uuid === uuid);
  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const title = formatDateFull(race?.raceDate);
  const tableData = buildTableRows(raceResults ?? []);
  const participants = raceResults?.length;
  const maleCount = raceResults?.filter(
    (r) => r.runner.gender === "Mann",
  ).length;
  const femaleCount = raceResults?.filter(
    (r) => r.runner.gender === "Kvinne",
  ).length;
  const yearBestCount = raceResults?.filter((r) => r.newSeasonBest).length ?? 0;
  const personalBestCount =
    raceResults?.filter((r) => r.newPersonalBest).length ?? 0;
  const debutantCount =
    raceResults?.filter((r) => r.totalRaces === 1).length ?? 0;
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
