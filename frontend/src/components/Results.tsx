import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import ResultsHeader from "@/components/ResultsHeader.tsx";
import { getNextRace, getPreviousRace } from "@/lib/utils.ts";

type Props = {
  uuid?: string;
};

export default function Results({ uuid }: Props) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const previous = getPreviousRace(races || [], uuid || undefined);
  const next = getNextRace(races || [], uuid || undefined);
  const path = "/Resultater/";
  const race = races?.find((r) => r.uuid);

  return (
    <div className="w-full max-w-2xl md:max-w-4xl space-y-3 md:space-y-5">
      <NavigationButtons previousRace={previous} nextRace={next} path={path} />

      {race && (
        <ResultsHeader race={race} photosPath={`/Bilder/${race.uuid}`} />
      )}

      {/*<ResultsTable*/}
      {/*  tableData={tableData}*/}
      {/*  title={title}*/}
      {/*  race={race}*/}
      {/*  year={year}*/}
      {/*  week={week}*/}
      {/*/>*/}

      {/*<PhotoCarousel*/}
      {/*  photos={racePhotos}*/}
      {/*  year={year}*/}
      {/*  week={week}*/}
      {/*  onPhotoClick={setLightboxIndex}*/}
      {/*/>*/}

      {/*<PhotoDialog*/}
      {/*  photos={racePhotos}*/}
      {/*  index={lightboxIndex}*/}
      {/*  onIndexChange={setLightboxIndex}*/}
      {/*/>*/}
    </div>
  );
}
