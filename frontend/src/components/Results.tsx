import { useQueries, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoCarousel from "@/components/PhotoCarousel.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import ResultsHeader from "@/components/ResultsHeader.tsx";
import ResultsTable from "@/components/ResultsTable.tsx";
import { type Photo, photos } from "@/data/mockdata.ts";
import { formatDateFull } from "@/lib/TimeUtils.ts";
import { buildTableRows, getNextRace, getPreviousRace } from "@/lib/utils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  uuid?: string;
};

export default function Results({ uuid }: Props) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const { data: raceRunners } = useQuery(
    QUERIES.race.getAllRunnersInRace(uuid ?? ""),
  );

  // Once we have the runners, fetch race count for each runner in parallel
  const runnerRaceQueries = useQueries({
    queries: (raceRunners ?? []).map((rr) =>
      QUERIES.runner.getAllRacesByRunner(rr.runner.uuid ?? ""),
    ),
  });

  // Build raceCountByRunner and allRacesByRunner maps from parallel queries
  const raceCountByRunner = useMemo(() => {
    const map: Record<string, number> = {};
    (raceRunners ?? []).forEach((rr, index) => {
      map[rr.runner.uuid ?? ""] = runnerRaceQueries[index]?.data?.length ?? 0;
    });
    return map;
  }, [raceRunners, runnerRaceQueries]);

  const allRacesByRunner = useMemo(() => {
    const map: Record<string, RaceRunnerDTO[]> = {};
    (raceRunners ?? []).forEach((rr, index) => {
      map[rr.runner.uuid ?? ""] = runnerRaceQueries[index]?.data ?? [];
    });
    return map;
  }, [raceRunners, runnerRaceQueries]);

  const previous = getPreviousRace(races || [], uuid || undefined);
  const next = getNextRace(races || [], uuid || undefined);
  const path = "/Resultater/";
  const race = races?.find((r) => r.uuid === uuid);
  const title = formatDateFull(race?.raceDate);

  const tableData = buildTableRows(
    raceRunners ?? [],
    raceCountByRunner,
    allRacesByRunner,
  );

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const racePhotos: Photo[] = useMemo(
    () => (race ? photos.filter((p) => p.raceId === race.uuid) : []),
    [race],
  );
  return (
    <div className="w-full max-w-2xl md:max-w-4xl space-y-3 md:space-y-5">
      <NavigationButtons previousRace={previous} nextRace={next} path={path} />

      {race && (
        <ResultsHeader
          race={race}
          photosPath={`/Bilder/${race.uuid}`}
          title={title}
        />
      )}

      <ResultsTable tableData={tableData} title={title} />

      <PhotoCarousel
        photos={racePhotos}
        uuid={uuid ?? ""}
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
