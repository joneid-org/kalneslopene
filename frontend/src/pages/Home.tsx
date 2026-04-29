import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Cloud, Droplets, Thermometer, Wind } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import { useYrWeather } from "@/lib/useYrWeather.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import SeasonStatBoxes from "../components/SeasonStatBoxes.tsx";
import SponsorsBlock from "../components/SponsorsBlock.tsx";
import cardImage from "../data/ChatGPT Image 29. apr. 2026, 11_32_50.png";

export function Home() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];
  const weather = useYrWeather(nextRace?.raceDate);

  return (
    <div>
      <div className="flex flex-col lg:flex-row items-start gap-6">
        {/* ── Main block ── */}
        <div className="flex flex-col w-full min-w-0">
          {/* Hero — flush to top, no gap above */}
          <div className="w-full">
            <section
              className="relative overflow-hidden w-full h-[40vh] lg:h-[40vh] min-h-60"
              style={{ maxHeight: "800px" }}
            >
              <img
                src={cardImage}
                alt="Torsdagsløpet"
                className="absolute inset-0 w-full h-full object-cover object-center"
              />
              {/* Dark overlay for depth */}
              <div className="absolute inset-0 bg-black/10" />
              {/* Dark gradient from bottom so text pops */}
              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-transparent to-transparent" />
              {/* Blue gradient from left */}
              <div className="absolute inset-0 bg-linear-to-r from-blue-950/20 to-transparent" />

              {/* Content — bottom center */}
              <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-14 py-4 sm:pb-6 max-w-7xl mx-auto">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-tight leading-none">
                      Torsdagsløpet
                    </h1>
                    <p className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] mb-1 mt-4">
                      Lavterskel løpsglede siden 1978
                    </p>
                  </div>

                  {/* Next race — centered below title */}
                  {nextRace && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto bg-black/50 backdrop-blur-md border border-white/30 rounded-2xl px-6 sm:px-9 py-3 sm:py-4 mx-auto shadow-xl">
                      <p className="text-xs font-bold uppercase tracking-widest text-white text-center">
                        Kommende løp
                      </p>
                      <div className="flex items-center justify-center gap-4">
                        <div className="text-center min-w-12">
                          <div className="text-2xl sm:text-3xl font-black text-white leading-none tabular-nums">
                            {formatDDMonth(nextRace.raceDate).split(".")[0]}.
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
                          {weather ? (
                            <>
                              <div className="flex items-center gap-2">
                                <Cloud className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                                {/*TODO: La iconet matche været. Sol ved sol, sky ved sky osv. */}
                                {weather.label}
                              </div>
                              <div className="flex items-center gap-2">
                                <Thermometer className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                                {weather.temperature}°C
                              </div>
                              <div className="flex items-center gap-2">
                                <Wind className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                                {weather.windSpeed} m/s
                              </div>
                              {weather.precipitation > 0 && (
                                <div className="flex items-center gap-2">
                                  <Droplets className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                                  {weather.precipitation} mm
                                </div>
                              )}
                            </>
                          ) : (
                            nextRace?.weather && (
                              <div className="flex items-center gap-2">
                                <Cloud className="size-3.5 sm:size-4 shrink-0 text-white/70" />
                                {nextRace.weather}
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            <div className="page-content py-4">
              <div className="text-center space-y-2">
                <p className="text-2xl sm:text-2xl font-black bg-green-500 text-gray-900 tracking-tight">
                  Snør på deg skoene - bli med i Torsdagsløpet!
                </p>
                <p className="text-sm  max-w-xl mx-auto">
                  Ingen forhåndspåmelding - du trenger kun å skrive deg på vår
                  deltakerliste før start. Gratis frukt til alle deltakere etter
                  løpet.{" "}
                </p>
                <Button>
                  Åpne løpskalender
                  <ArrowRight></ArrowRight>
                </Button>
              </div>
            </div>

            <div className="page-content">
              <NewsFeed />
            </div>
            <div className="page-content">
              <SeasonStatBoxes />
            </div>
            <div className="page-content pb-8 flex flex-col gap-6">
              <OrganisersBlock />
              <SponsorsBlock />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
