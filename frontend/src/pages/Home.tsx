import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Cloud, MapPin, Ruler, Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import RaceInfoBlock from "../components/RaceInfoBlock.tsx";
import cardImage from "../data/cardImage.jpg";

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  return (
    <div className="flex flex-col bg-white">
      {/* ══════════════════════════════════════
          HERO — image fills the top, text anchored at bottom-left
         ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ height: "52vh", minHeight: "320px", maxHeight: "560px" }}
      >
        <img
          src={cardImage}
          alt="Torsdagsløpet"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        {/* Dark gradient from bottom so text pops */}
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent" />
        {/* Subtle blue tint from the left */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/40 to-transparent" />

        {/* Content — bottom left */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-14 pb-8 max-w-7xl mx-auto">
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
                      formatDDMonth(nextRace.raceDate).split(". ")[1] ?? ""
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

      {/* ══════════════════════════════════════
          QUICK NAV — slim strip under hero
         ══════════════════════════════════════ */}
      {/*<div className="border-b border-gray-100 bg-white">*/}
      {/*  <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-3 flex items-center gap-6">*/}
      {/*    <Link*/}
      {/*      to="/Resultater"*/}
      {/*      className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"*/}
      {/*    >*/}
      {/*      <Trophy className="size-3.5" />*/}
      {/*      Siste resultater*/}
      {/*      <ArrowRight className="size-3" />*/}
      {/*    </Link>*/}
      {/*    <span className="text-gray-200">|</span>*/}
      {/*    <Link*/}
      {/*      to="/Statistikk"*/}
      {/*      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"*/}
      {/*    >*/}
      {/*      <CalendarDays className="size-3.5" />*/}
      {/*      Statistikk*/}
      {/*    </Link>*/}
      {/*    <span className="text-gray-200">|</span>*/}
      {/*    <Link*/}
      {/*      to="/Bilder"*/}
      {/*      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"*/}
      {/*    >*/}
      {/*      Bilder*/}
      {/*    </Link>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/* ══════════════════════════════════════
          MAIN CONTENT — clean white
         ══════════════════════════════════════ */}
      <div className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-10 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14 items-start">
            {/* Left */}
            <div className="flex flex-col gap-12 min-w-0">
              <RaceInfoBlock />

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <CalendarDays className="size-4 text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Siste nytt
                  </h2>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <NewsFeed />
              </section>

              <section>
                <div className="flex items-center gap-3 mb-6">
                  <Users className="size-4 text-blue-600" />
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Arrangørene
                  </h2>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>
                <OrganisersBlock />
              </section>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:sticky lg:top-6">
              <RaceCalendarSidebar />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
