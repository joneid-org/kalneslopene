import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/Pictures/PhotoGrid.tsx";
import PhotoHeader from "@/components/Pictures/PhotoHeader.tsx";
import NavigationButtons from "@/components/Results/NavigationButtons.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";
import { getNextRace, getPreviousRace } from "@/lib/utils.ts";

export function Pictures() {
  const { uuid = "" } = useParams<{ uuid: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { data: races } = useQuery(QUERIES.race.getAllRaces());

  const allRaces = races ?? [];
  const race = allRaces.find((r) => r.uuid === uuid);
  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const title = formatDateFull(race?.raceDate);

  const racePhotos = race?.photos ?? [];

  return (
    <div className="page-content space-y-3 md:space-y-5">
      {race && (
        <NavigationButtons
          previousRace={previous}
          nextRace={next}
          path="/Bilder/"
        />
      )}

      <PhotoHeader
        title={title ?? ""}
        photoCount={racePhotos.length}
        photographers={[]}
        resultsPath={race ? `/Resultater/${race.uuid}` : undefined}
      />

      <PhotoGrid photos={racePhotos} onPhotoClick={setLightboxIndex} />

      <PhotoDialog
        photos={racePhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
