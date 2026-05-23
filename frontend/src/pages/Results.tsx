import { useQueries, useQuery } from "@tanstack/react-query";
import { Mars, Star, UsersIcon, Venus } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import NavigationButtons from "@/components/Results/NavigationButtons.tsx";
import PhotoCarousel from "@/components/Results/PhotoCarousel.tsx";
import ResultsHeader from "@/components/Results/ResultsHeader.tsx";
import ResultsTable from "@/components/Results/ResultsTable.tsx";
import StatBox from "@/components/StatBox.tsx";
import { photos } from "@/data/mockdata.ts";
import {
  getNewPersonalBestCount,
  getNewYearBestCount,
} from "@/lib/statisticsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import {
  buildTableRows,
  getNextRace,
  getPhotosByRaceId,
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
  const racePhotos = useMemo(
    () => getPhotosByRaceId(photos, race?.uuid),
    [race],
  );

  return (
    <div className="page-content space-y-3 md:space-y-5">
      <NavigationButtons
        previousRace={previous}
        nextRace={next}
        path="/Resultater/"
      />

      {race && (
        <ResultsHeader
          race={race}
          photosPath={`/Bilder/${race.uuid}`}
          title={title}
        />
      )}

      <div className="grid grid-cols-3 gap-1 sm:gap-2 md:gap-4">
        <StatBox
          icon={UsersIcon}
          value={participants}
          label="Deltakere"
          compact
        />
        <StatBox icon={Mars} value={maleCount} label="Menn" compact />
        <StatBox icon={Venus} value={femaleCount} label="Kvinner" compact />
        <StatBox icon={Star} value={yearBestCount} label="Årsbeste" compact />
        <StatBox
          icon={Star}
          value={personalBestCount}
          label="Personlig rekord"
          compact
        />
        {/*TODO: Hvor mange er nye i løpet.*/}
        <StatBox
          icon={Star}
          value={personalBestCount}
          label="Debutanter"
          compact
        />
      </div>

      <ResultsTable tableData={tableData} title={title} />

      <PhotoCarousel
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
