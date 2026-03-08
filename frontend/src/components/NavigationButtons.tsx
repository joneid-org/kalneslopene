import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";

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
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center gap-2">
      <Button
        size="sm"
        variant="ghost"
        className="text-xs md:text-sm gap-1 px-2 md:px-3 md:h-9"
        disabled={!prevRace}
        onClick={() => prevRace && navigate(raceToPath(prevRace))}
      >
        <ChevronLeft className="size-3.5 md:size-4" />
        {prevRace
          ? `Uke ${prevRace.week}, ${new Date(prevRace.date).getFullYear()}`
          : "Første løp"}
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="text-xs md:text-sm gap-1 px-2 md:px-3 md:h-9"
        disabled={!nextRace}
        onClick={() => nextRace && navigate(raceToPath(nextRace))}
      >
        {nextRace
          ? `Uke ${nextRace.week}, ${new Date(nextRace.date).getFullYear()}`
          : "Siste løp"}
        <ChevronRight className="size-3.5 md:size-4" />
      </Button>
    </div>
  );
}
