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
import {
  buildTableRows,
  getMostRecentRace,
  getNextRace,
  getPreviousRace,
} from "@/lib/utils.ts";

export function Results() {
  const { uuid = "" } = useParams<{ uuid: string }>();

  const { data: allRaces = [] } = useQuery(
    QUERIES.race.getAllRaceInfos({ isPublished: true }),
  );
  const {
    data: race,
    isPending: raceQueryPending,
    isPlaceholderData: raceIsStale,
  } = useQuery({
    ...QUERIES.race.getRaceByUuid(uuid),
    enabled: !!uuid,
  });
  const {
    data: raceRunners,
    isError: runnersQueryError,
    isPlaceholderData: runnersAreStale,
  } = useQuery({
    ...QUERIES.race.getAllRunnersInRace(uuid),
    enabled: !!uuid,
  });
  const {
    data: summary,
    isError: summaryQueryError,
    isPlaceholderData: summaryIsStale,
  } = useQuery({
    ...QUERIES.race.getResultSummary(uuid),
    enabled: !!uuid,
  });

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // keepPreviousData lets each query resolve on its own, so without this the
  // previous race's results would show under the new race's title. Anything
  // that isn't confirmed to belong to the race in the title is dropped, and
  // the page shows a loading state until its own data arrives.
  const runnersLoaded = !!raceRunners && !runnersAreStale;
  const summaryLoaded = !!summary && !summaryIsStale;
  const isLoadingRaceData =
    raceIsStale ||
    (!runnersLoaded && !runnersQueryError) ||
    (!summaryLoaded && !summaryQueryError);

  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const tableData = buildTableRows(runnersLoaded ? raceRunners : []);
  const raceSummary = summaryLoaded ? summary : undefined;
  const racePhotos = race?.photos ?? [];

  if (!race) {
    const latest = getMostRecentRace(allRaces);
    if (!uuid && latest) {
      return <Navigate to={`/resultater/${latest.uuid}`} replace />;
    }
    if (raceQueryPending) {
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

      <ResultsHeader race={race} />

      <div className="grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3">
        <StatTile
          value={raceSummary?.participants}
          label="Deltakere"
          isLoading={isLoadingRaceData}
        />
        <StatTile
          value={raceSummary?.male}
          label="Menn"
          isLoading={isLoadingRaceData}
        />
        <StatTile
          value={raceSummary?.female}
          label="Kvinner"
          isLoading={isLoadingRaceData}
        />
        <StatTile
          value={raceSummary?.seasonBestCount}
          label="Årsbeste"
          tone="primary"
          isLoading={isLoadingRaceData}
        />
        <StatTile
          value={raceSummary?.personalBestCount}
          label="Personlig rek."
          tone="primary"
          isLoading={isLoadingRaceData}
        />
        <StatTile
          value={raceSummary?.debutantCount}
          label="Debutanter"
          tone="brand"
          isLoading={isLoadingRaceData}
        />
      </div>

      <ResultsTable tableData={tableData} isLoading={isLoadingRaceData} />

      <RacePhotoGrid
        photos={racePhotos}
        uuid={race.uuid}
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
