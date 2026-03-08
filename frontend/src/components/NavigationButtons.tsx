import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";

type Race = {
  week: number;
  date: string;
};

type Props = {
  prevRace: Race | null;
  nextRace: Race | null;
  raceToPath: (race: Race) => string;
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
          {`Uke ${prevRace.week}, ${new Date(prevRace.date).getFullYear()}`}
        </Link>
      ) : (
        <span />
      )}
      {nextRace && (
        <Link
          to={raceToPath(nextRace)}
          className="flex items-center gap-1 text-xs md:text-sm px-2 md:px-3 py-1.5 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          {`Uke ${nextRace.week}, ${new Date(nextRace.date).getFullYear()}`}
          <ChevronRight className="size-3.5 md:size-4" />
        </Link>
      )}
    </div>
  );
}
