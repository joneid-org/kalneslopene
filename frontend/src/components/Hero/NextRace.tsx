import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Droplets,
  Eye,
  Sun,
  SunDim,
  Thermometer,
  Wind,
} from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import { useYrWeather } from "@/lib/useYrWeather.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

function weatherIcon(symbol: string): LucideIcon {
  const s = symbol.replace(/_day|_night/, "");
  if (s === "clearsky") return Sun;
  if (s === "fair") return SunDim;
  if (s === "partlycloudy") return SunDim;
  if (s === "cloudy") return Cloud;
  if (s === "fog") return Eye;
  if (s.includes("thunder")) return CloudLightning;
  if (s.includes("snow")) return CloudSnow;
  if (s.includes("sleet")) return CloudDrizzle;
  if (s.includes("heavyrain")) return CloudRain;
  if (s.includes("rain")) return CloudRain;
  return Cloud;
}

function WeatherRow({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 sm:size-4 shrink-0 text-white/70" />
      {children}
    </div>
  );
}

export function NextRace() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const race = getUpcomingRaces(races ?? [])[0];
  const weather = useYrWeather(race?.raceDate);

  if (!race) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 w-full sm:w-auto bg-black/50 backdrop-blur-md border border-white/30 rounded-2xl px-6 sm:px-9 py-3 sm:py-4 mx-auto shadow-xl">
      <p className="text-xs font-bold uppercase tracking-widest text-white text-center">
        Kommende løp
      </p>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center min-w-12">
          <div className="text-2xl sm:text-3xl font-black text-white leading-none tabular-nums">
            {formatDDMonth(race.raceDate).split(".")[0]}.
          </div>
          <div className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-white/80 mt-1">
            {(formatDDMonth(race.raceDate).split(". ")[1] ?? "").toUpperCase()}
          </div>
        </div>
        <div className="w-px h-8 bg-white/30" />
        <div className="text-sm sm:text-base text-white space-y-1.5">
          {weather ? (
            <div className="flex gap-4">
              <div>
                <WeatherRow icon={weatherIcon(weather.symbol)}>
                  {weather.label}
                </WeatherRow>
                <WeatherRow icon={Thermometer}>
                  {weather.temperature}°C
                </WeatherRow>
              </div>
              <div>
                <WeatherRow icon={Wind}>{weather.windSpeed} m/s</WeatherRow>
                {weather.precipitation > 0 && (
                  <WeatherRow icon={Droplets}>
                    {weather.precipitation} mm
                  </WeatherRow>
                )}
              </div>
            </div>
          ) : (
            race.weather && <WeatherRow icon={Cloud}>{race.weather}</WeatherRow>
          )}
        </div>
      </div>
    </div>
  );
}
