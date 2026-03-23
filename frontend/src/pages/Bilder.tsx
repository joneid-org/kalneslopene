import { useMemo, useState } from "react";
import { useParams } from "react-router";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/PhotoGrid.tsx";
import PhotoHeader from "@/components/PhotoHeader.tsx";
import type { Photo } from "@/data/mockdata.ts";
import { photos, races } from "@/data/mockdata.ts";
import { getAllRacesByYear } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function Bilder() {
  const { year, raceId } = useParams<{
    year: string;
    raceId: string;
  }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const parsedYear = year ? Number(year) : undefined;

  const raceDTOs: RaceDTO[] = useMemo(
    () =>
      races.map((r) => ({
        id: r.id,
        raceDate: new Date(r.date),
        weather: r.weatherConditions ?? "",
      })),
    [],
  );

  const sortedRaces = useMemo(
    () =>
      [...races].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [],
  );

  // Returns day-of-month numbers for races in the given year
  const raceDaysInYear: number[] = useMemo(
    () => (parsedYear ? getAllRacesByYear(parsedYear, raceDTOs) : []),
    [parsedYear, raceDTOs],
  );

  const race = useMemo(() => {
    if (!raceId) return null;
    return sortedRaces.find((r) => r.id === raceId) ?? null;
  }, [raceId, sortedRaces]);

  const currentIndex = useMemo(
    () => (race ? sortedRaces.findIndex((r) => r.id === race.id) : -1),
    [race, sortedRaces],
  );

  const prevRace = currentIndex > 0 ? sortedRaces[currentIndex - 1] : null;
  const nextRace =
    currentIndex !== -1 && currentIndex < sortedRaces.length - 1
      ? sortedRaces[currentIndex + 1]
      : null;

  function raceToPath(r: { id: string; week: number; date: string }) {
    const y = new Date(r.date).getFullYear();
    return `/Bilder/${y}/${r.id}`;
  }

  const racePhotos: Photo[] = useMemo(() => {
    if (race) return photos.filter((p) => p.raceId === race.id);
    if (parsedYear) {
      const idsInYear = raceDTOs
        .filter((r) => {
          const d = r.raceDate;
          return (
            d.getFullYear() === parsedYear &&
            raceDaysInYear.includes(d.getDate())
          );
        })
        .map((r) => r.id);
      return photos.filter((p) => idsInYear.includes(p.raceId));
    }
    return photos;
  }, [race, parsedYear, raceDaysInYear, raceDTOs]);

  const title = race
    ? `${new Date(race.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`
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
              ? `/Resultater/${new Date(race.date).getFullYear()}/${race.id}`
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
