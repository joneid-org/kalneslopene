import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CheckCircle,
  Cloud,
  MapPin,
  Mic,
  Ruler,
  UserCheck,
  Wallet,
} from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import cardImage from "../data/cardImage.jpg";

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  const practicalInfo = [
    { icon: Wallet, label: "Gratis" },
    { icon: UserCheck, label: "Alle aldre og nivåer" },
    { icon: Car, label: "Stor parkering" },
    { icon: CheckCircle, label: "Ingen forhåndspåmelding" },
    { icon: Mic, label: "Tid ropes opp ved mål" },
  ];
  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Main block ── */}
        <div className="flex flex-col gap-6 lg:flex-1 min-w-0 w-full lg:items-center">
          {/* Hero + practical info unified block */}
          <div className="w-full">
            <section
              className="relative overflow-hidden w-full"
              style={{ height: "40vh", minHeight: "320px", maxHeight: "560px" }}
            >
              <img
                src={cardImage}
                alt="Torsdagsløpet"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Dark gradient from bottom so text pops */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
              {/* Subtle blue tint from the left */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-950/40 to-transparent" />

              {/* Content — bottom left */}
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-14 pb-6 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-blue-300 mb-2">
                      Kalnesskogen · Sarpsborg · siden 1978
                    </p>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                      Torsdagsløpet
                    </h1>
                  </div>

                  {/* Next race pill — bottom right */}
                  {nextRace && (
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 shrink-0">
                      <div className="text-center">
                        <div className="text-2xl font-black text-white leading-none tabular-nums">
                          {formatDDMonth(nextRace.raceDate).split(".")[0]}
                        </div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-blue-200">
                          {(
                            formatDDMonth(nextRace.raceDate).split(". ")[1] ??
                            ""
                          ).toUpperCase()}
                        </div>
                      </div>
                      <div className="w-px h-8 bg-white/20" />
                      <div className="text-sm text-blue-100 space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3 shrink-0" />
                          Kalnesskogen
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Ruler className="size-3 shrink-0" />
                          {DISTANCE_KM} km ·
                          <span className="flex items-center gap-1">
                            kl {formatTimeStamp(nextRace.raceDate)}
                          </span>
                        </div>
                        {nextRace.weather && (
                          <div className="flex items-center gap-1.5">
                            <Cloud className="size-3 shrink-0" />
                            {nextRace.weather}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Practical info — flush below hero, same width, dark continuation */}
            <div className="bg-gray-900 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/10">
                {practicalInfo.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <Icon className="size-4 sm:size-5 text-blue-400 shrink-0" />
                    <span className="text-[10px] sm:text-sm font-semibold text-gray-200 leading-snug">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:max-w-2xl px-2 sm:px-4 md:px-8">
            <NewsFeed />
          </div>
          <div className="w-full lg:max-w-2xl px-2 sm:px-4 md:px-8 pb-8">
            <OrganisersBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
