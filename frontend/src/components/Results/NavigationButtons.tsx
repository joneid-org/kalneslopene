import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { formatDate } from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type Props = {
  previousRace: RaceDTO | null;
  nextRace: RaceDTO | null;
  path: string;
};

const linkClass =
  "flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors";

export default function NavigationButtons({
  previousRace,
  nextRace,
  path,
}: Props) {
  return (
    <div className="flex justify-between items-center gap-2">
      {previousRace ? (
        <Link to={`${path}${previousRace.uuid}`} className={linkClass}>
          <ChevronLeft className="size-3.5 md:size-4" />
          {formatDate(previousRace.raceDate)}
        </Link>
      ) : (
        <span />
      )}
      {nextRace && (
        <Link to={`${path}${nextRace.uuid}`} className={linkClass}>
          {formatDate(nextRace.raceDate)}
          <ChevronRight className="size-3.5 md:size-4" />
        </Link>
      )}
    </div>
  );
}
