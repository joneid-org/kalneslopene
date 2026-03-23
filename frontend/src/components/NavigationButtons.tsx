import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import type { RaceDTO } from "@/model/DTO.ts";

type Props = {
  prevRace: RaceDTO | null;
  nextRace: RaceDTO | null;
  raceToPath: (race: RaceDTO) => string;
};

export default function NavigationButtons({
  prevRace,
  nextRace,
  raceToPath,
}: Props) {
  return (
    <div className="flex justify-between items-center gap-2">
      {prevRace ? (
        <Link
          to={raceToPath(prevRace)}
          className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <ChevronLeft className="size-3.5 md:size-4" />
          {prevRace.raceDate.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Link>
      ) : (
        <span />
      )}
      {nextRace && (
        <Link
          to={raceToPath(nextRace)}
          className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {nextRace.raceDate.toLocaleDateString("nb-NO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
          <ChevronRight className="size-3.5 md:size-4" />
        </Link>
      )}
    </div>
  );
}
