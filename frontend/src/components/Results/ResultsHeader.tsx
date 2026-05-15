import { Images } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import type { RaceDTO } from "@/model/DTO.ts";

type ResultsHeaderProps = {
  race: RaceDTO;
  photosPath?: string;
  title?: string;
};

export default function ResultsHeader({
  race,
  photosPath,
  title,
}: ResultsHeaderProps) {
  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
      <img
        src="https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
        alt=""
        className="w-full h-44 sm:h-64 md:h-80 object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

      {photosPath && (
        <Button
          asChild
          size="sm"
          variant="secondary"
          className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm text-xs gap-1.5"
        >
          <Link to={photosPath}>
            <Images className="size-3.5" />
            Se bilder
          </Link>
        </Button>
      )}

      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 md:px-5 md:pb-5 text-white">
        <p className="text-sm md:text-lg font-semibold leading-snug">{title}</p>
        {race.weather && (
          <span className="text-xs md:text-sm text-white/80 mt-1">
            {race.weather}
          </span>
        )}
      </div>
    </div>
  );
}
