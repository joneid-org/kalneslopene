import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  CalendarDays,
  Car,
  CheckCircle,
  Clock,
  Cloud,
  MapPin,
  Mic,
  Ruler,
  Trophy,
  UserCheck,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";
import cardImage from "../data/cardImage.jpg";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

const practicalInfo = [
  { icon: Wallet, label: "Gratis" },
  { icon: UserCheck, label: "Alle aldre og nivåer" },
  { icon: Car, label: "Stor parkering" },
  { icon: CheckCircle, label: "Ingen forhåndspåmelding" },
  { icon: Mic, label: "Tid ropes opp ved mål" },
];

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* ══════════════════════════════════════
          HERO — full-bleed dark, image as right-side accent on desktop
         ══════════════════════════════════════ */}
      <section className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden">
        {/* Image — fills right ~60% on desktop, full bg on mobile */}
        <div className="absolute inset-0 lg:left-[38%]">
          <img
            src={cardImage}
            alt="Torsdagsløpet"
            className="w-full h-full object-cover object-center"
          />
          {/* Fade left into dark bg */}
          <div className="absolute inset-0 bg-linear-to-r from-white via-white/85 to-white/10" />
          {/* Fade bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-white via-white/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10 lg:px-16 pb-16 pt-24">
          <p className="text-blue-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">
            Kalnesskogen · Sarpsborg · siden 1978
          </p>
          <h1 className="text-6xl sm:text-8xl lg:text-[9rem] font-black leading-none tracking-tighter text-gray-900 mb-6">
            Tors
            <br />
            dags
            <br className="sm:hidden" />
            <span className="text-blue-600">løpet</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
            Gratis mosjonsløp for alle — hver torsdag i skogen siden 1978.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/Resultater"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-200"
            >
              <Trophy className="size-4" />
              Se resultater
            </Link>
            <Link
              to="/Statistikk"
              className="inline-flex items-center gap-2 border border-gray-200 hover:border-blue-300 text-gray-600 hover:text-blue-600 font-semibold text-sm px-6 py-3 rounded-full transition-all"
            >
              <CalendarDays className="size-4" />
              Statistikk
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEXT RACE — dark strip
         ══════════════════════════════════════ */}
      {nextRace && (
        <div className="border-y border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-widest text-green-600">
                Neste løp
              </span>
            </div>
            <div className="text-gray-900 font-black text-xl tabular-nums">
              {formatDDMonth(nextRace.raceDate)}
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-blue-500" />
                kl {formatTimeStamp(nextRace.raceDate)}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-blue-500" />
                Kalnesskogen
              </span>
              <span className="flex items-center gap-1.5">
                <Ruler className="size-3.5 text-blue-500" />
                {DISTANCE_KM} km
              </span>
              {nextRace.weather && (
                <span className="flex items-center gap-1.5">
                  <Cloud className="size-3.5 text-blue-500" />
                  {nextRace.weather}
                </span>
              )}
            </div>
            <Link
              to="/Resultater"
              className="sm:ml-auto flex items-center gap-1 text-blue-600 hover:text-blue-700 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Siste resultater <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════
          PRACTICAL INFO — bold dark grid
         ══════════════════════════════════════ */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {practicalInfo.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex flex-col gap-2 py-4 border-t-2 border-blue-600"
              >
                <Icon className="size-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700 leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          NEWS + CALENDAR — two column, dark
         ══════════════════════════════════════ */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 lg:gap-16 items-start">
            {/* News */}
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
                Siste nytt
              </h2>
              <NewsFeed />
            </div>

            {/* Sidebar */}
            <aside className="lg:sticky lg:top-24">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">
                Kommende løp
              </h2>
              <RaceCalendarSidebar />
            </aside>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          ORGANISERS — dark footer section
         ══════════════════════════════════════ */}
      <div className="border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-12">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-6">
            Arrangørene
          </h2>
          <OrganisersBlock />
        </div>
      </div>
    </div>
  );
}
