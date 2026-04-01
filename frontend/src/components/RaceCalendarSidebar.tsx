import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { formatDDMonth, formatTimeStamp } from "@/lib/TimeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

export default function RaceCalendarSidebar() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const upComingRaces = getUpcomingRaces(races ?? []);

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-primary" />
          Kommende løp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        {upComingRaces.length === 0 ? (
          <p className="text-sm text-muted-foreground px-6 pb-4">
            Ingen kommende løp registrert.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {upComingRaces.map((race, idx) => {
              const isNext = idx === 0;

              return (
                <li
                  key={race.uuid}
                  className="flex items-center gap-5 px-8 py-3"
                >
                  {/* Date column */}
                  <div className="flex flex-col items-center w-10 shrink-0 text-center">
                    <span className="text-lg font-bold leading-none tabular-nums text-primary">
                      {formatDDMonth(race.raceDate).split(".")[0]}
                    </span>
                    <span className="text-xs text-primary mt-0.5">
                      {formatDDMonth(race.raceDate).split(". ")[1]}
                    </span>
                  </div>

                  <div className="w-px self-stretch bg-border shrink-0" />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium">Blå løype</span>
                      {isNext && (
                        <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-100 text-green-700 border-green-200">
                          Neste
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-5 mt-0.5 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        Torsdag kl {formatTimeStamp(race.raceDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        Kalnesskogen
                      </span>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
