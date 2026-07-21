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

  const racesQuery = useQuery(QUERIES.race.getAllRaces());
  const races = racesQuery.data;
  const { data: raceRunners } = useQuery(
    QUERIES.race.getAllRunnersInRace(uuid),
  );
  const { data: summary } = useQuery(QUERIES.race.getResultSummary(uuid));

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const allRaces = (races ?? []).filter((r) => r.isPublished);
  const race = allRaces.find((r) => r.uuid === uuid);
  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const title = formatDateFull(race?.raceDate);
  const tableData = buildTableRows(raceRunners ?? []);
  const racePhotos = race?.photos ?? [];

  if (!race) {
    const latest = getMostRecentRace(allRaces);
    if (!uuid && latest) {
      return <Navigate to={`/resultater/${latest.uuid}`} replace />;
    }
    if (racesQuery.isPending) {
      return null;
    }
    throw new Response("Fant ikke løpet", { status: 404 });
  }

  return (
    <div className="page-content flex flex-col gap-4 md:gap-6">
      <RaceSwitcher
        race={race}
        previousRace={previous}
        nextRace={next}
        path="/resultater/"
      />

      <ResultsHeader race={race} title={title} />

      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        <StatTile value={summary?.participants} label="Deltakere" />
        <StatTile value={summary?.male} label="Menn" />
        <StatTile value={summary?.female} label="Kvinner" />
        <StatTile
          value={summary?.seasonBestCount}
          label="Årsbeste"
          tone="primary"
        />
        <StatTile
          value={summary?.personalBestCount}
          label="Personlig rek."
          tone="primary"
        />
        <StatTile
          value={summary?.debutantCount}
          label="Debutanter"
          tone="brand"
        />
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
