import { useQuery } from "@tanstack/react-query";
import { Cloud, MapPin, Ruler } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import cardImage from "../data/Messenger_creation_56DB2467-9FDC-4ED1-9316-C458D96DC9A5.jpeg";

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Main block ── */}
        <div className="flex flex-col gap-6 lg:flex-1 min-w-0 w-full lg:items-center">
          {/* Hero + practical info unified block */}
          <div className="w-full">
            <section
              className="relative overflow-hidden w-full bg-blue-900 sm:bg-transparent sm:h-[28vh] sm:min-h-50"
              style={{ maxHeight: "560px" }}
            >
              <img
                src={cardImage}
                alt="Torsdagsløpet"
                className="hidden sm:block absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Dark overlay for depth */}
              <div className="hidden sm:block absolute inset-0 bg-black/10" />
              {/* Dark gradient from bottom so text pops */}
              <div className="hidden sm:block absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
              {/* Blue gradient from left */}
              <div className="hidden sm:block absolute inset-0 bg-linear-to-r from-blue-950/20 to-transparent" />

              {/* Content — bottom left */}
              <div className="sm:absolute sm:bottom-0 sm:left-0 sm:right-0 px-4 sm:px-8 lg:px-14 py-4 sm:pb-6 sm:pt-0 max-w-7xl sm:mx-auto">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-3">
                  <div className="hidden sm:block">
                    <p className="hidden sm:block text-xs font-bold uppercase tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mb-1">
                      Kalnesskogen · Sarpsborg · siden 1978
                    </p>
                    <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-tight leading-none">
                      Torsdagsløpet
                    </h1>
                  </div>

                  {/* Next race pill — bottom right */}
                  {nextRace && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto sm:bg-black/50 sm:backdrop-blur-md sm:border sm:border-white/30 sm:rounded-2xl sm:px-9 sm:py-4 sm:shrink-0 sm:shadow-xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-white">
                        Neste løp
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="text-center min-w-12">
                          <div className="text-2xl sm:text-3xl font-black text-white leading-none tabular-nums">
                            {formatDDMonth(nextRace.raceDate).split(".")[0]}
                          </div>
                          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80 mt-1">
                            {(
                              formatDDMonth(nextRace.raceDate).split(". ")[1] ??
                              ""
                            ).toUpperCase()}
                          </div>
                        </div>
                        <div className="w-px h-8 bg-white/30" />
                        <div className="text-sm sm:text-base text-white space-y-1.5">
                          <div className="flex items-center gap-2">
                            <MapPin className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                            Kalnesskogen
                          </div>
                          <div className="flex items-center gap-2">
                            <Ruler className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                            {DISTANCE_KM} km · kl{" "}
                            {formatTimeStamp(nextRace.raceDate)}
                          </div>
                          {nextRace.weather && (
                            <div className="flex items-center gap-2">
                              <Cloud className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                              {nextRace.weather}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
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
