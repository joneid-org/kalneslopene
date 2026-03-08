import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
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
  week?: number;
  onPhotoClick: (idx: number) => void;
};

export default function PhotoCarousel({
  photos,
  year,
  week,
  onPhotoClick,
}: PhotoCarouselProps) {
  const navigate = useNavigate();

  if (photos.length === 0) return null;

  return (
    <Card>
      <CardHeader className="py-3 md:py-4 px-4 md:px-6 pb-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-base font-semibold">
            Bilder
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            className="text-xs md:text-sm gap-1 h-7 md:h-9"
            onClick={() => navigate(`/Bilder/${year}/${week}`)}
          >
            Se alle
            <ChevronRight className="size-3.5 md:size-4" />
          </Button>
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
