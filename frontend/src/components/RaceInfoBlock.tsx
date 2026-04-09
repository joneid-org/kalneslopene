import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, MapPin, Ruler } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM, RACE_INFORMATION } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

const practicalInformation = [
  "Gratis for alle",
  "Alle aldre og nivåer",
  "Stor parkeringsplass",
  "Ingen forhåndspåmelding",
  "Tid ropes opp ved målgang",
];

export default function RaceInfoBlock() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  return (
    <section className="space-y-8">
      {/* ── Next race banner ── */}
      {nextRace ? (
        <div className="relative overflow-hidden rounded-2xl bg-blue-600 text-white">
          {/* Background decoration */}
          <div className="absolute -right-12 -top-12 size-56 rounded-full bg-white/5" />
          <div className="absolute -right-4 bottom-0 size-40 rounded-full bg-blue-500/40" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6 p-6 sm:p-8">
            {/* Big date */}
            <div className="shrink-0 text-center bg-white/10 rounded-xl px-6 py-4 border border-white/20 min-w-[90px]">
              <div className="text-4xl font-black leading-none tabular-nums">
                {formatDDMonth(nextRace.raceDate).split(".")[0]}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-blue-200 mt-1">
                {formatDDMonth(nextRace.raceDate).split(". ")[1] ?? ""}
              </div>
            </div>

            {/* Details */}
            <div className="flex-1">
              <div className="text-xs font-semibold text-blue-200 uppercase tracking-widest mb-1">
                Neste løp
              </div>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight mb-2">
                Torsdagsløpet
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-blue-100">
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  Kl {formatTimeStamp(nextRace.raceDate)}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  Kalnesskogen
                </span>
                <span className="flex items-center gap-1.5">
                  <Ruler className="size-3.5" />
                  {DISTANCE_KM} km
                </span>
              </div>
            </div>

            {/* Free badge */}
            <div className="shrink-0 self-start sm:self-center">
              <span className="inline-block bg-green-400 text-green-950 text-xs font-extrabold uppercase tracking-widest px-4 py-2 rounded-full shadow-lg">
                Gratis
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 border border-gray-100 px-6 py-8 text-center text-gray-400 text-sm">
          Ingen kommende løp registrert.
        </div>
      )}

      {/* ── Info text ── */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {RACE_INFORMATION}
      </p>

      {/* ── Practical info ── */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
          Praktisk informasjon
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {practicalInformation.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-sm text-gray-700"
            >
              <CheckCircle className="size-4 text-blue-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
