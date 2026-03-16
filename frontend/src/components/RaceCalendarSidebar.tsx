import { CalendarDays, Clock, Loader2, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { RaceDTO } from "@/model/DTO.ts";

interface RaceCalendarSidebarProps {
  races: RaceDTO[] | undefined;
  isLoading: boolean;
}

export default function RaceCalendarSidebar({
  races,
  isLoading,
}: RaceCalendarSidebarProps) {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-primary" />
          Kommende løp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <UpcomingRaces races={races} isLoading={isLoading} />
      </CardContent>
    </Card>
  );
}

const UpcomingRaces = ({ races, isLoading }: RaceCalendarSidebarProps) => {
  if (isLoading)
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  if (!races || races.length === 0)
    return (
      <p className="text-sm text-muted-foreground px-6 pb-4">
        Ingen kommende løp.
      </p>
    );
  return (
    <ul className="divide-y divide-border">
      {races.map((race, index) => {
        const date = new Date(race.raceDate);
        const time = date.toLocaleTimeString("nb-NO", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const isNext = index === 0;

        return (
          <li key={race.id} className="flex items-start gap-3 px-6 py-3">
            <div className="flex flex-col items-center min-w-10 text-center">
              <span className="text-lg font-bold leading-none tabular-nums text-primary">
                {date.getDate()}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {date.toLocaleDateString("nb-NO", { month: "short" })}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium">Torsdagsløpet</span>
                {isNext && (
                  <Badge className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 text-blue-700 border-blue-200">
                    Neste
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-3 shrink-0" />
                  kl {time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3 shrink-0" />
                  Kalnesskogen
                </span>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};
