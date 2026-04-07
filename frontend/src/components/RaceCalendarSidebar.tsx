import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

export default function RaceCalendarSidebar() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const upComingRaces = getUpcomingRaces(races ?? []);

  return (
    <div className="flex flex-col gap-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 rounded-full bg-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Kommende løp
        </h2>
        <CalendarDays className="size-4 text-gray-400 ml-1" />
      </div>

      {upComingRaces.length === 0 ? (
        <p className="text-sm text-gray-400">Ingen kommende løp registrert.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {upComingRaces.map((race, idx) => {
            const isNext = idx === 0;
            const parts = formatDDMonth(race.raceDate).split(". ");
            const day = parts[0];
            const month = parts[1] ?? "";

            return (
              <li
                key={race.uuid}
                className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 border transition-all ${
                  isNext
                    ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-sm"
                }`}
              >
                {/* Date badge */}
                <div
                  className={`flex flex-col items-center w-11 shrink-0 text-center rounded-xl py-1.5 ${
                    isNext ? "bg-white/20" : "bg-gray-100"
                  }`}
                >
                  <span
                    className={`text-xl font-bold leading-none tabular-nums ${isNext ? "text-white" : "text-blue-600"}`}
                  >
                    {day}
                  </span>
                  <span
                    className={`text-[10px] font-semibold mt-0.5 uppercase tracking-wider ${isNext ? "text-blue-100" : "text-gray-500"}`}
                  >
                    {month}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-semibold ${isNext ? "text-white" : "text-gray-900"}`}
                    >
                      Blå løype
                    </span>
                    {isNext && (
                      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-white/20 text-white border-white/30">
                        Neste
                      </Badge>
                    )}
                  </div>
                  <div
                    className={`flex items-center gap-3 mt-1 text-xs flex-wrap ${isNext ? "text-blue-100" : "text-gray-500"}`}
                  >
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
    </div>
  );
}
