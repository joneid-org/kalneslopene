import { ArrowDown, CalendarDays, Trophy } from "lucide-react";
import { Link } from "react-router";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import RaceInfoBlock from "../components/RaceInfoBlock.tsx";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1600&q=80";

export function Home() {
  return (
    <div className="flex flex-col">
      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center overflow-hidden"
        style={{ minHeight: "38vh" }}
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_IMAGE})` }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-900/70 via-blue-800/60 to-gray-900/80" />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 py-12 sm:py-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/20">
            <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
            Hver torsdag i Kalnesskogen
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-lg mb-3">
            Torsdagsløpet
          </h1>
          <p className="text-blue-100 text-base sm:text-lg font-light mb-6 leading-relaxed">
            Fellesskap og frisk luft siden 1978 — gratis for alle
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/Resultater"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg transition-all hover:shadow-blue-500/30 hover:scale-105"
            >
              <Trophy className="size-4" />
              Se resultater
            </Link>
            <Link
              to="/Statistikk"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white text-sm font-semibold px-5 py-2.5 rounded-full border border-white/30 transition-all hover:scale-105"
            >
              <CalendarDays className="size-4" />
              Statistikk
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden sm:block">
          <ArrowDown className="size-5" />
        </div>
      </section>

      {/* ── Main content ── */}
      <div className="bg-gray-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-8 lg:px-12">
          {/* Desktop: true two-column layout. Mobile: single column */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
            {/* ── Left column ── */}
            <div className="flex flex-col gap-8 min-w-0">
              <RaceInfoBlock />
              <NewsFeed />
              <OrganisersBlock />
            </div>

            {/* ── Right sidebar ── */}
            <aside className="w-full lg:sticky lg:top-20 lg:max-h-[calc(100vh-6rem)] flex flex-col gap-6">
              <RaceCalendarSidebar />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
