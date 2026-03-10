import { useMemo, useState } from "react";
import { useParams } from "react-router";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/PhotoGrid.tsx";
import PhotoHeader from "@/components/PhotoHeader.tsx";
import type { Photo } from "@/data/mockdata.ts";
import { getRacesByYear, photos, races } from "@/data/mockdata.ts";

export function Bilder() {
  const { year, raceNumber } = useParams<{
    year: string;
    raceNumber: string;
  }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const parsedYear = year ? Number(year) : undefined;
  const parsedWeek = raceNumber ? Number(raceNumber) : undefined;

  const sortedRaces = useMemo(
    () =>
      [...races].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [],
  );

  const race = useMemo(() => {
    if (!parsedYear || !parsedWeek) return null;
    return (
      getRacesByYear(parsedYear).find((r) => r.week === parsedWeek) ?? null
    );
  }, [parsedYear, parsedWeek]);

  const currentIndex = useMemo(
    () => (race ? sortedRaces.findIndex((r) => r.id === race.id) : -1),
    [race, sortedRaces],
  );

  const prevRace = currentIndex > 0 ? sortedRaces[currentIndex - 1] : null;
  const nextRace =
    currentIndex !== -1 && currentIndex < sortedRaces.length - 1
      ? sortedRaces[currentIndex + 1]
      : null;

  function raceToPath(r: { week: number; date: string }) {
    const y = new Date(r.date).getFullYear();
    return `/Bilder/${y}/${r.week}`;
  }

  const racePhotos: Photo[] = useMemo(() => {
    if (race) return photos.filter((p) => p.raceId === race.id);
    if (parsedYear) {
      const racesInYear = getRacesByYear(parsedYear);
      return photos.filter((p) => racesInYear.some((r) => r.id === p.raceId));
    }
    return photos;
  }, [race, parsedYear]);

  const title = race
    ? `Uke ${race.week} — ${new Date(race.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`
    : parsedYear
      ? `Bilder – ${parsedYear}`
      : "Alle bilder";

  const photographers = useMemo(() => {
    const names = racePhotos
      .map((p) => p.photographer)
      .filter((n): n is string => !!n);
    return [...new Set(names)];
  }, [racePhotos]);

  return (
    <div className="px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="w-full md:max-w-7xl md:mx-auto space-y-3 md:space-y-5">
        {race && (
          <NavigationButtons
            prevRace={prevRace}
            nextRace={nextRace}
            raceToPath={raceToPath}
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
