import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import type { Photo } from "@/data/mockdata.ts";
import { getRacesByYear, photos } from "@/data/mockdata.ts";

export function Bilder() {
  const { year, raceNumber } = useParams<{
    year: string;
    raceNumber: string;
  }>();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const parsedYear = year ? Number(year) : undefined;
  const parsedWeek = raceNumber ? Number(raceNumber) : undefined;

  const race = (() => {
    if (!parsedYear || !parsedWeek) return null;
    const racesInYear = getRacesByYear(parsedYear);
    return racesInYear.find((r) => r.week === parsedWeek) ?? null;
  })();

  const racePhotos: Photo[] = race
    ? photos.filter((p) => p.raceId === race.id)
    : parsedYear
      ? photos.filter((p) => {
          const racesInYear = getRacesByYear(parsedYear);
          return racesInYear.some((r) => r.id === p.raceId);
        })
      : photos;

  const title = race
    ? `Bilder – Uke ${race.week}, ${new Date(race.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`
    : parsedYear
      ? `Bilder – ${parsedYear}`
      : "Alle bilder";

  return (
    <div className="flex justify-center px-2 py-4 sm:px-4 sm:py-8">
      <div className="w-full max-w-2xl space-y-3">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <p className="text-xs text-muted-foreground">
              {racePhotos.length} bilder
            </p>
          </CardHeader>
        </Card>

        {racePhotos.length > 0 ? (
          <Card>
            <CardContent className="py-3 px-2 sm:px-4">
              <Carousel className="w-full" opts={{ align: "start" }}>
                <CarouselContent className="-ml-2">
                  {racePhotos.map((photo, idx) => (
                    <CarouselItem
                      key={photo.id}
                      className="pl-2 basis-1/2 sm:basis-1/3"
                    >
                      <button
                        type="button"
                        className="w-full aspect-square overflow-hidden rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        onClick={() => setLightboxIndex(idx)}
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption}
                          className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                        />
                      </button>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {racePhotos.length > 2 && (
                  <>
                    <CarouselPrevious className="left-1" />
                    <CarouselNext className="right-1" />
                  </>
                )}
              </Carousel>
            </CardContent>
          </Card>
        ) : (
          <p className="text-sm text-muted-foreground px-1">
            Ingen bilder tilgjengelig.
          </p>
        )}

        {/* Lightbox */}
        <Dialog
          open={lightboxIndex !== null}
          onOpenChange={(open) => !open && setLightboxIndex(null)}
        >
          <DialogContent className="max-w-screen-sm p-2 sm:p-4 bg-black border-0">
            <DialogTitle className="sr-only">
              Bilde {(lightboxIndex ?? 0) + 1} av {racePhotos.length}
            </DialogTitle>
            {lightboxIndex !== null && (
              <div className="relative">
                <img
                  src={racePhotos[lightboxIndex].url}
                  alt={racePhotos[lightboxIndex].caption}
                  className="w-full rounded-md object-contain max-h-[80vh]"
                />
                {racePhotos[lightboxIndex].caption && (
                  <p className="text-center text-xs text-white/70 mt-2">
                    {racePhotos[lightboxIndex].caption}
                  </p>
                )}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    type="button"
                    className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                    disabled={lightboxIndex === 0}
                    onClick={() =>
                      setLightboxIndex((i) => (i !== null ? i - 1 : null))
                    }
                  >
                    <ChevronLeft className="size-7" />
                  </button>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    type="button"
                    className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                    disabled={lightboxIndex === racePhotos.length - 1}
                    onClick={() =>
                      setLightboxIndex((i) => (i !== null ? i + 1 : null))
                    }
                  >
                    <ChevronRight className="size-7" />
                  </button>
                </div>
                <p className="absolute bottom-6 inset-x-0 text-center text-xs text-white/50">
                  {lightboxIndex + 1} / {racePhotos.length}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
