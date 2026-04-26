import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/PhotoGrid.tsx";
import PhotoHeader from "@/components/PhotoHeader.tsx";
import { photos } from "@/data/mockdata.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import {
  getNextRace,
  getPhotosByRaceId,
  getPreviousRace,
} from "@/lib/utils.ts";

export function Bilder() {
  const { uuid } = useParams<{ uuid: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const previous = getPreviousRace(races ?? [], uuid);
  const next = getNextRace(races ?? [], uuid);
  const path = "/Bilder/";
  const race = races?.find((r) => r.uuid === uuid);
  const title = formatDateFull(race?.raceDate);

  const racePhotos = useMemo(() => getPhotosByRaceId(photos, uuid), [uuid]);

  const photographers = useMemo(() => {
    const names = racePhotos
      .map((p) => p.photographer)
      .filter((n): n is string => !!n);
    return [...new Set(names)];
  }, [racePhotos]);

  return (
    <div className="page-content">
      <div className="w-full space-y-3 md:space-y-5">
        {race && (
          <NavigationButtons
            previousRace={previous}
            nextRace={next}
            path={path}
          />
        )}

        <PhotoHeader
          title={title ?? ""}
          photoCount={racePhotos.length}
          photographers={photographers}
          resultsPath={race ? `/Resultater/${race.uuid}` : undefined}
        />

        <PhotoGrid photos={racePhotos} onPhotoClick={setLightboxIndex} />

        <PhotoDialog
          photos={racePhotos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />
      </div>
    </div>
  );
}
