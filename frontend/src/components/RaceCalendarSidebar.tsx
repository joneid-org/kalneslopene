import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Clock, MapPin } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

export default function RaceCalendarSidebar() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const upComingRaces = getUpcomingRaces(races ?? []);

  return (
    <div className="flex flex-col gap-5">
      {/* Heading */}
      <div className="flex items-center gap-2">
        <CalendarDays className="size-4 text-blue-600" />
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
          Kommende løp
        </h2>
      </div>

      {upComingRaces.length === 0 ? (
        <p className="text-sm text-gray-400">Ingen kommende løp registrert.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {upComingRaces.map((race, idx) => {
            const isNext = idx === 0;
            const [dayStr, monthStr] = formatDDMonth(race.raceDate).split(". ");

            return (
              <li key={race.uuid}>
                {isNext ? (
                  /* ── Featured next race ── */
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-5 shadow-lg shadow-blue-200">
                    <div className="absolute -right-6 -bottom-6 size-28 rounded-full bg-white/5" />
                    <div className="flex items-start gap-4">
                      {/* Date block */}
                      <div className="shrink-0 bg-white/15 rounded-xl px-3 py-2 text-center border border-white/20 min-w-[52px]">
                        <div className="text-2xl font-black leading-none">
                          {dayStr}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200 mt-0.5">
                          {monthStr ?? ""}
                        </div>
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="inline-flex items-center gap-1 bg-green-400/20 text-green-300 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5">
                          <span className="size-1.5 rounded-full bg-green-400" />
                          Neste
                        </div>
                        <p className="font-bold text-base leading-tight">
                          Torsdagsløpet
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-blue-200 flex-wrap">
                          <span className="flex items-center gap-1">
                            <Clock className="size-3" />
                            Kl {formatTimeStamp(race.raceDate)}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            Kalnesskogen
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ── Upcoming race row ── */
                  <div className="group flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 rounded-lg px-2 -mx-2 transition-colors cursor-default">
                    <div className="shrink-0 w-10 text-center">
                      <div className="text-lg font-black text-gray-800 leading-none">
                        {dayStr}
                      </div>
                      <div className="text-[10px] font-semibold uppercase text-gray-400 tracking-wide">
                        {monthStr}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 truncate">
                        Torsdagsløpet
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="size-3" />
                        Kl {formatTimeStamp(race.raceDate)}
                      </p>
                    </div>
                    <ArrowRight className="size-3.5 text-gray-300 group-hover:text-blue-400 transition-colors shrink-0" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
