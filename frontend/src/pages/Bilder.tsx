import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/PhotoGrid.tsx";
import PhotoHeader from "@/components/PhotoHeader.tsx";
import type { Photo } from "@/data/mockdata.ts";
import { getRacesByYear, photos } from "@/data/mockdata.ts";
import { getNextRace, getPreviousRace } from "@/lib/utils.ts";

type Props = {
  uuid?: string;
};

export function Bilder({ uuid }: Props) {
  const { year, raceNumber } = useParams<{
    year: string;
    raceNumber: string;
  }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const parsedYear = year ? Number(year) : undefined;
  const parsedWeek = raceNumber ? Number(raceNumber) : undefined;

  const race = useMemo(() => {
    if (!parsedYear || !parsedWeek) return null;
    return (
      getRacesByYear(parsedYear).find((r) => r.week === parsedWeek) ?? null
    );
  }, [parsedYear, parsedWeek]);

  const racePhotos: Photo[] = useMemo(() => {
    if (race) return photos.filter((p) => p.raceId === race.id);
    if (parsedYear) {
      const racesInYear = getRacesByYear(parsedYear);
      return photos.filter((p) => racesInYear.some((r) => r.id === p.raceId));
    }
    return photos;
  }, [race, parsedYear]);

  const title = race
    ? `Uke ${race.week} — ${new Date(race.date).toLocaleDateString("nb-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    : parsedYear
      ? `Bilder – ${parsedYear}`
      : "Alle bilder";

  const photographers = useMemo(() => {
    const names = racePhotos
      .map((p) => p.photographer)
      .filter((n): n is string => !!n);
    return [...new Set(names)];
  }, [racePhotos]);

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const previous = getPreviousRace(races || [], uuid || undefined);
  const next = getNextRace(races || [], uuid || undefined);
  const path = "/Bilder/";
  return (
    <div className="px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="w-full md:max-w-7xl md:mx-auto space-y-3 md:space-y-5">
        {race && (
          <NavigationButtons
            previousRace={previous}
            nextRace={next}
            path={path}
          />
        )}

        <PhotoHeader
          title={title}
          photoCount={racePhotos.length}
          photographers={photographers}
          resultsPath={
            race
              ? `/Resultater/${new Date(race.date).getFullYear()}/${race.week}`
              : undefined
          }
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
