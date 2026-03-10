import { useMemo, useState } from "react";
import NavigationButtons from "@/components/NavigationButtons.tsx";
import PhotoCarousel from "@/components/PhotoCarousel.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import ResultsHeader from "@/components/ResultsHeader.tsx";
import ResultsTable, { type RowData } from "@/components/ResultsTable.tsx";
import type { Photo } from "../data/mockdata.ts";
import { getRacesByYear, photos, races, results } from "../data/mockdata.ts";

const DISTANCE_KM = 5;

function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return Number.POSITIVE_INFINITY;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return Number.POSITIVE_INFINITY;
}

function formatSecondsToTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "-";
  const rounded = Math.round(totalSeconds);
  const mm = Math.floor(rounded / 60);
  const ss = rounded % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

type Props = {
  year?: number;
  week?: number;
};

export default function Results({ year, week }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // All races sorted oldest → newest (for prev/next)
  const sortedRaces = useMemo(
    () =>
      [...races].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [],
  );

  const race = useMemo(() => {
    if (!year || !week) return null;
    return getRacesByYear(year).find((r) => r.week === week) ?? null;
  }, [year, week]);

  const currentIndex = useMemo(
    () => (race ? sortedRaces.findIndex((r) => r.id === race.id) : -1),
    [race, sortedRaces],
  );

  const prevRace = currentIndex > 0 ? sortedRaces[currentIndex - 1] : null;
  const nextRace =
    currentIndex !== -1 && currentIndex < sortedRaces.length - 1
      ? sortedRaces[currentIndex + 1]
      : null;

  function raceToPath(race: { week: number; date: string }) {
    const y = new Date(race.date).getFullYear();
    return `/Resultater/${y}/${race.week}`;
  }

  // Per-runner stats
  const byRunner = useMemo(
    () =>
      results.reduce<
        Record<
          string,
          {
            races: number;
            personalBestSeconds: number;
            bestThisYearSeconds: number;
          }
        >
      >((acc, r) => {
        const key = r.runnerId;
        const t = parseTimeToSeconds(r.time);
        if (!acc[key]) {
          acc[key] = {
            races: 1,
            personalBestSeconds: t,
            bestThisYearSeconds: t,
          };
          return acc;
        }
        acc[key].races += 1;
        acc[key].personalBestSeconds = Math.min(
          acc[key].personalBestSeconds,
          t,
        );
        acc[key].bestThisYearSeconds = Math.min(
          acc[key].bestThisYearSeconds,
          t,
        );
        return acc;
      }, {}),
    [],
  );

  const tableData: RowData[] = useMemo(() => {
    const filtered = race
      ? results
          .filter((r) => r.raceId === race.id)
          .sort((a, b) => {
            if (a.gender !== b.gender) return a.gender === "M" ? -1 : 1;
            return a.position - b.position;
          })
      : results;

    return filtered.map((r) => {
      const stats = byRunner[r.runnerId];
      const timeSeconds = parseTimeToSeconds(r.time);
      const paceSeconds =
        DISTANCE_KM > 0 ? timeSeconds / DISTANCE_KM : Number.NaN;
      return {
        ...r,
        races: stats?.races ?? 0,
        pace: formatSecondsToTime(paceSeconds),
        pr: stats ? formatSecondsToTime(stats.personalBestSeconds) : "-",
        yearBest: stats ? formatSecondsToTime(stats.bestThisYearSeconds) : "-",
      };
    });
  }, [race, byRunner]);

  // Fastest M and F
  const fastestM = useMemo(
    () =>
      tableData
        .filter((r) => r.gender === "M")
        .sort(
          (a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time),
        )[0],
    [tableData],
  );
  const fastestF = useMemo(
    () =>
      tableData
        .filter((r) => r.gender === "F")
        .sort(
          (a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time),
        )[0],
    [tableData],
  );

  const racePhotos: Photo[] = useMemo(
    () => (race ? photos.filter((p) => p.raceId === race.id) : []),
    [race],
  );

  const title = race
    ? `Uke ${race.week} — ${new Date(race.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`
    : "Alle resultater";

  return (
    <div className="w-full max-w-2xl md:max-w-4xl space-y-3 md:space-y-5">
      <NavigationButtons
        prevRace={prevRace}
        nextRace={nextRace}
        raceToPath={raceToPath}
      />

      {race && (
        <ResultsHeader
          race={race}
          title={title}
          fastestM={fastestM}
          fastestF={fastestF}
          photosPath={
            racePhotos.length > 0
              ? `/Bilder/${new Date(race.date).getFullYear()}/${race.week}`
              : undefined
          }
        />
      )}

      <ResultsTable
        tableData={tableData}
        title={title}
        race={race}
        year={year}
        week={week}
      />

      <PhotoCarousel
        photos={racePhotos}
        year={year}
        week={week}
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
