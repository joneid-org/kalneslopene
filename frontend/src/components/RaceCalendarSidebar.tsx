import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

export default function RaceCalendarSidebar() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const upComingRaces = getUpcomingRaces(races ?? []);

  if (upComingRaces.length === 0) {
    return (
      <p className="text-sm text-gray-400">Ingen kommende løp registrert.</p>
    );
  }

  return (
    <ul className="space-y-2">
      {upComingRaces.map((race, idx) => {
        const isNext = idx === 0;
        const [dayStr, monthStr] = formatDDMonth(race.raceDate).split(". ");

        if (isNext) {
          return (
            <li key={race.uuid}>
              <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-4 shadow-md shadow-blue-100">
                <div className="absolute -right-4 -bottom-4 size-24 rounded-full bg-white/10" />
                <div className="flex items-center gap-4">
                  <div className="shrink-0 bg-white/20 rounded-xl px-3 py-2 text-center border border-white/20 min-w-12">
                    <div className="text-xl font-black leading-none text-white">
                      {dayStr}
                    </div>
                    <div className="text-[9px] font-bold uppercase tracking-widest text-blue-100 mt-0.5">
                      {monthStr ?? ""}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-green-300">
                        Neste
                      </span>
                    </div>
                    <p className="font-bold text-sm text-white leading-tight">
                      Torsdagsløpet
                    </p>
                    <p className="text-xs text-blue-100 flex items-center gap-1 mt-0.5 flex-wrap">
                      <Clock className="size-3" />
                      kl {formatTimeStamp(race.raceDate)}
                      <MapPin className="size-3 ml-1" />
                      Kalnesskogen
                    </p>
                  </div>
                </div>
              </div>
            </li>
          );
        }

        return (
          <li key={race.uuid}>
            <div className="group flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white transition-colors">
              <div className="shrink-0 w-9 text-center">
                <div className="text-base font-black text-gray-800 leading-none">
                  {dayStr}
                </div>
                <div className="text-[9px] font-semibold uppercase text-gray-400 tracking-wide">
                  {monthStr}
                </div>
              </div>
              <div className="w-px h-7 bg-gray-200 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-700">
                  Torsdagsløpet
                </p>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Clock className="size-3" />
                  kl {formatTimeStamp(race.raceDate)}
                </p>
              </div>
              <ArrowRight className="size-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
