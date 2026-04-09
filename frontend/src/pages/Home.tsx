import { ArrowDown, CalendarDays, Trophy, Users } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import messengerImg from "../data/Messenger_creation_56DB2467-9FDC-4ED1-9316-C458D96DC9A5.jpeg";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import RaceInfoBlock from "../components/RaceInfoBlock.tsx";
import { QUERIES } from "@/api/queries.ts";
import { getNumberOfRaces } from "@/lib/statisticsUtils.ts";

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const totalRaces = getNumberOfRaces(races ?? []);

  const stats = [
    {
      value: totalRaces > 0 ? String(totalRaces) : "…",
      label: "Løp arrangert",
    },
    { value: "47", label: "År med løping" },
    { value: "5,1", label: "Kilometer" },
    { value: "1978", label: "Grunnlagt" },
  ];

  return (
    <div className="flex flex-col bg-white">
      {/* ══════════════════════════════════════
          HERO — full-bleed with messenger image
         ══════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ minHeight: "75vh" }}
      >
        {/* Background image */}
        <img
          src={messengerImg}
          alt="Torsdagsløpet i Kalnesskogen"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Layered overlays for cinematic feel */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-linear-to-r from-blue-950/60 via-transparent to-transparent" />

        {/* Noise texture overlay for depth */}
        <div
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />

        {/* Live badge — top right */}
        <div className="absolute top-6 right-6 z-20 hidden sm:flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full border border-white/20 shadow">
          <span className="size-2 rounded-full bg-green-400 animate-pulse" />
          Hver torsdag
        </div>

        {/* Hero content — bottom anchored, full width */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          {/* Stats strip */}
          <div className="hidden lg:grid grid-cols-4 divide-x divide-white/10 bg-black/40 backdrop-blur-sm border-t border-white/10 mb-0">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center py-4 gap-0.5"
              >
                <span className="text-2xl font-extrabold text-white tabular-nums">
                  {value}
                </span>
                <span className="text-[11px] text-white/60 uppercase tracking-widest font-medium">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* Main headline block */}
          <div className="px-6 sm:px-10 lg:px-16 pb-10 sm:pb-14 pt-8 max-w-4xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-white/70 uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-blue-400" />
              Kalnesskogen, Sarpsborg
            </div>
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-white tracking-tighter leading-none mb-4 drop-shadow-2xl">
              Torsdags
              <br className="hidden sm:block" />
              løpet
            </h1>
            <p className="text-white/80 text-lg sm:text-xl font-light max-w-lg mb-8 leading-relaxed">
              Gratis mosjonsløp for alle — fellesskap og frisk luft siden 1978.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/Resultater"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm px-7 py-3.5 rounded-full shadow-2xl shadow-blue-900/50 transition-all hover:scale-105 hover:shadow-blue-500/40"
              >
                <Trophy className="size-4" />
                Se resultater
              </Link>
              <Link
                to="/Statistikk"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-sm text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/25 transition-all hover:scale-105"
              >
                <Users className="size-4" />
                Løpsstatistikk
              </Link>
              <Link
                to="/Bilder"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 active:scale-95 backdrop-blur-sm text-white font-semibold text-sm px-7 py-3.5 rounded-full border border-white/25 transition-all hover:scale-105"
              >
                <CalendarDays className="size-4" />
                Bilder
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll chevron */}
        <div className="absolute bottom-6 right-8 z-20 text-white/30 animate-bounce hidden lg:block">
          <ArrowDown className="size-5" />
        </div>
      </section>

      {/* Mobile stats bar */}
      <div className="grid grid-cols-4 bg-blue-700 lg:hidden">
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center justify-center py-3 gap-0.5 border-r border-blue-600 last:border-r-0"
          >
            <span className="text-base font-extrabold text-white tabular-nums leading-tight">
              {value}
            </span>
            <span className="text-[9px] text-blue-200 uppercase tracking-wider font-medium text-center px-1 leading-tight">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          MAIN CONTENT — white background, editorial
         ══════════════════════════════════════ */}
      <div className="flex-1 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-14 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 lg:gap-16 items-start">
            {/* ── Left: main content ── */}
            <div className="flex flex-col gap-14 min-w-0">
              <RaceInfoBlock />

              {/* Divider with label */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                  Siste nytt
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <NewsFeed />

              {/* Divider with label */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-gray-100" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-300">
                  Arrangørene
                </span>
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <OrganisersBlock />
            </div>

            {/* ── Right: sticky sidebar ── */}
            <aside className="w-full lg:sticky lg:top-20 flex flex-col gap-6">
              <RaceCalendarSidebar />
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
