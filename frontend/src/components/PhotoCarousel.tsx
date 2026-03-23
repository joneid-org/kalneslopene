import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
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
import type { Photo } from "../data/mockdata.ts";

type PhotoCarouselProps = {
  photos: Photo[];
  year?: number;
  dateMonth?: string;
  onPhotoClick: (idx: number) => void;
};

export default function PhotoCarousel({
  photos,
  year,
  dateMonth,
  onPhotoClick,
}: PhotoCarouselProps) {
  if (photos.length === 0) return null;

  return (
    <Card>
      <CardHeader className="py-3 md:py-4 px-4 md:px-6 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-semibold">
            Bilder
          </CardTitle>
          <Link
            to={`/Bilder/${year}/${dateMonth}`}
            className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            Se alle
            <ChevronRight className="size-3.5 md:size-4" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-2 sm:px-4 md:px-6">
        <Carousel className="w-full" opts={{ align: "start" }}>
          <CarouselContent className="-ml-2">
            {photos.map((photo, idx) => (
              <CarouselItem
                key={photo.id}
                className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4"
              >
                <button
                  type="button"
                  className="w-full aspect-square overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  onClick={() => onPhotoClick(idx)}
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
          {photos.length > 2 && (
            <>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </>
          )}
        </Carousel>
      </CardContent>
    </Card>
  );
}
