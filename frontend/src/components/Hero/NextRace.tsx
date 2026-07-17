import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
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
import { formatDDMonth, formatRaceDateTime } from "@/lib/timeUtils.ts";
import { useYrWeather, type YrWeatherResult } from "@/lib/useYrWeather.ts";
import { cn, getUpcomingRaces } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

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

function WeatherItem({
  icon: Icon,
  className,
  children,
}: {
  icon: LucideIcon;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "flex items-center gap-1.5 text-sm font-semibold text-white",
        className,
      )}
    >
      <Icon className="size-4 shrink-0 text-white/70" />
      {children}
    </span>
  );
}

function DateBadge({ day, month }: { day: string; month: string }) {
  return (
    <div className="shrink-0 text-center bg-brand rounded-xl w-14.5 sm:w-15.5 py-2 sm:py-2.25">
      <div className="font-display font-black text-2xl sm:text-[26px] leading-none tabular-nums text-brand-foreground">
        {day}.
      </div>
      <div className="text-[10px] font-extrabold uppercase tracking-wider text-brand-foreground/80">
        {month}
      </div>
    </div>
  );
}

function DateBadgeSkeleton() {
  return (
    <div className="shrink-0 h-12.5 sm:h-13.5 w-14.5 sm:w-15.5 rounded-xl bg-white/10 animate-pulse" />
  );
}

function NextRaceEmpty() {
  return (
    <div className="flex w-full items-center justify-center gap-2.5 py-1 text-center">
      <CalendarDays className="size-5 shrink-0 text-white/55" />
      <span className="font-display text-base font-extrabold text-white sm:text-lg">
        Ses neste sesong
      </span>
    </div>
  );
}

function StackedSkeleton() {
  return (
    <>
      <DateBadgeSkeleton />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
        <div className="h-4 w-40 rounded bg-white/10 animate-pulse" />
      </div>
    </>
  );
}

function OverlaySkeleton() {
  return (
    <>
      <DateBadgeSkeleton />
      <div className="min-w-0 flex-1 flex items-center gap-5.5">
        <div className="min-w-0 flex-1 border-r border-white/15 pr-5.5 space-y-2.5">
          <div className="h-3 w-24 rounded bg-white/10 animate-pulse" />
          <div className="h-5 w-52 rounded bg-white/10 animate-pulse" />
        </div>
        <div className="flex shrink-0 gap-5">
          <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
          <div className="h-4 w-14 rounded bg-white/10 animate-pulse" />
        </div>
      </div>
    </>
  );
}

type NextRaceVariantProps = {
  isPending: boolean;
  race: RaceDTO | undefined;
  weather: YrWeatherResult | undefined;
};

// Mobile: full-rounded card tucked under the hero, weather-forward
function NextRaceStacked({ isPending, race, weather }: NextRaceVariantProps) {
  const [day, month] = race
    ? formatDDMonth(race.raceDate).split(". ")
    : ["", ""];

  return (
    <div className="relative -mt-7.5 mx-3 flex items-center justify-center gap-3.5 rounded-2xl bg-brand-ink px-4 py-3.5 shadow-[0_16px_30px_-16px_rgba(18,58,40,0.6)]">
      {isPending ? (
        <StackedSkeleton />
      ) : !race ? (
        <NextRaceEmpty />
      ) : (
        <>
          <DateBadge day={day} month={month} />
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/65">
              Kommende løp
            </div>
            <div className="mt-0.5 truncate font-display text-base font-extrabold text-white">
              {formatRaceDateTime(race.raceDate)}
            </div>
            {weather && (
              <div className="mt-1.5 space-y-1">
                <WeatherItem icon={weatherIcon(weather.symbol)}>
                  {weather.label}
                </WeatherItem>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <WeatherItem
                    icon={Wind}
                    className="text-[13px] font-medium text-white/85"
                  >
                    {weather.windSpeed} m/s
                  </WeatherItem>
                  <WeatherItem
                    icon={Thermometer}
                    className="text-[13px] font-medium text-white/85"
                  >
                    {weather.temperature}°C
                  </WeatherItem>
                  {weather.precipitation > 0 && (
                    <WeatherItem
                      icon={Droplets}
                      className="text-[13px] font-medium text-white/85"
                    >
                      {weather.precipitation} mm
                    </WeatherItem>
                  )}
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// Desktop: top-rounded card overlapping the base of the full-bleed hero
function NextRaceOverlay({ isPending, race, weather }: NextRaceVariantProps) {
  const [day, month] = race
    ? formatDDMonth(race.raceDate).split(". ")
    : ["", ""];

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[min(640px,calc(100%-72px))] flex items-center gap-5.5 rounded-t-2xl bg-brand-ink px-6 py-4.5 shadow-[0_-10px_30px_-16px_rgba(18,58,40,0.5)]">
      {isPending ? (
        <OverlaySkeleton />
      ) : !race ? (
        <NextRaceEmpty />
      ) : (
        <>
          <DateBadge day={day} month={month} />
          <div className="min-w-0 flex-1 flex items-center gap-5.5">
            <div className="min-w-0 flex-1 border-r border-white/15 pr-5.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                Kommende løp
              </div>
              <div className="mt-0.5 truncate font-display text-lg font-extrabold text-white">
                {formatRaceDateTime(race.raceDate)}
              </div>
            </div>
            <div className="flex shrink-0 gap-5">
              {weather ? (
                <>
                  <WeatherItem icon={weatherIcon(weather.symbol)}>
                    {weather.label}
                  </WeatherItem>
                  <WeatherItem icon={Wind}>{weather.windSpeed} m/s</WeatherItem>
                  <WeatherItem icon={Thermometer}>
                    {weather.temperature}°C
                  </WeatherItem>
                  {weather.precipitation > 0 && (
                    <WeatherItem icon={Droplets}>
                      {weather.precipitation} mm
                    </WeatherItem>
                  )}
                </>
              ) : (
                race.weather && (
                  <WeatherItem icon={Cloud}>{race.weather}</WeatherItem>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function NextRace({
  variant = "overlay",
}: {
  variant?: "overlay" | "stacked";
}) {
  const {
    data: races,
    isPending,
    isError,
  } = useQuery(QUERIES.race.getAllRaces());
  const race = getUpcomingRaces(races ?? [])[0];
  const weather = useYrWeather(race?.raceDate);

  if (isError && !races) return null;

  const props = { isPending, race, weather };

  return variant === "stacked" ? (
    <NextRaceStacked {...props} />
  ) : (
    <NextRaceOverlay {...props} />
  );
}
