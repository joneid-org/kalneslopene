import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import PhotoGrid from "@/components/Pictures/PhotoGrid.tsx";
import PhotoHeader from "@/components/Pictures/PhotoHeader.tsx";
import { SortablePhotoGrid } from "@/components/Pictures/SortablePhotoGrid.tsx";
import NavigationButtons from "@/components/Results/NavigationButtons.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import { getNextRace, getPreviousRace } from "@/lib/utils.ts";
import type { RaceDTO, ReorderPhotoInput, S3FileDto } from "@/model/DTO.ts";

type ReorderVariables = ReorderPhotoInput & {
  raceUuid: string;
  newOrder: S3FileDto[];
};

export function Pictures() {
  const { uuid = "" } = useParams<{ uuid: string }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const racesQueryOptions = QUERIES.race.getAllRaces();
  const racesQuery = useQuery(racesQueryOptions);
  const races = racesQuery.data;

  const reorderMutation = useMutation({
    mutationFn: (input: ReorderVariables) =>
      MUTATIONS.race.reorderPhoto(input.raceUuid, input),
    onMutate: (input) => {
      qc.setQueryData<RaceDTO[]>(racesQueryOptions.queryKey, (cached) =>
        cached?.map((r) =>
          r.uuid === input.raceUuid ? { ...r, photos: input.newOrder } : r,
        ),
      );
    },
    onSuccess: (photos, input) => {
      qc.setQueryData<RaceDTO[]>(racesQueryOptions.queryKey, (cached) =>
        cached?.map((r) => (r.uuid === input.raceUuid ? { ...r, photos } : r)),
      );
    },
    onError: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
    },
  });

  const allRaces = (races ?? []).filter((r) => r.isPublished);
  const race = allRaces.find((r) => r.uuid === uuid);
  const previous = getPreviousRace(allRaces, uuid);
  const next = getNextRace(allRaces, uuid);
  const title = formatDateFull(race?.raceDate);

  const racePhotos = race?.photos ?? [];

  if (uuid && !race && !racesQuery.isPending) {
    throw new Response("Fant ikke løpet", { status: 404 });
  }

  function handleReorder(movedUuid: string, newOrder: S3FileDto[]) {
    if (!race) return;
    const idx = newOrder.findIndex((p) => p.uuid === movedUuid);
    const nextPhoto = newOrder[idx + 1];
    const prevPhoto = newOrder[idx - 1];
    if (nextPhoto) {
      reorderMutation.mutate({
        raceUuid: race.uuid,
        fileUuid: movedUuid,
        beforeFileUuid: nextPhoto.uuid,
        newOrder,
      });
    } else if (prevPhoto) {
      reorderMutation.mutate({
        raceUuid: race.uuid,
        fileUuid: movedUuid,
        afterFileUuid: prevPhoto.uuid,
        newOrder,
      });
    }
  }

  return (
    <div className="page-content space-y-3 md:space-y-5">
      {race && (
        <NavigationButtons
          previousRace={previous}
          nextRace={next}
          path="/bilder/"
        />
      )}

      <PhotoHeader
        title={title ?? ""}
        photoCount={racePhotos.length}
        photographers={[]}
        resultsPath={race ? `/resultater/${race.uuid}` : undefined}
        isAdmin={isAuthenticated}
        isEditing={isEditing}
        onToggleEditing={() => setIsEditing((v) => !v)}
      />

      {isEditing ? (
        <SortablePhotoGrid photos={racePhotos} onReorder={handleReorder} />
      ) : (
        <PhotoGrid photos={racePhotos} onPhotoClick={setLightboxIndex} />
      )}

      <PhotoDialog
        photos={racePhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
