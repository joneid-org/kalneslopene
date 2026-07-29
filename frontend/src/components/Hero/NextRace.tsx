import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import { CalendarDays, Footprints } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDDMonth, formatRaceDateTime } from "@/lib/timeUtils.ts";
import { cn } from "@/lib/utils.ts";
import { weatherItems } from "@/lib/weatherDisplay.ts";
import type { RaceDTO, WeatherDto } from "@/model/DTO.ts";

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
        Sees neste sesong
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
  weather: WeatherDto | undefined;
};

// Mobile: full-rounded card tucked under the hero, weather-forward
function NextRaceStacked({ isPending, race, weather }: NextRaceVariantProps) {
  const [day, month] = race
    ? formatDDMonth(race.raceDate).split(". ")
    : ["", ""];
  const items = weatherItems(weather);

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
              <div className="mt-1.5 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  {items.symbol && (
                    <WeatherItem icon={items.symbol.icon}>
                      {items.symbol.text}
                    </WeatherItem>
                  )}
                  {items.temperature && (
                    <WeatherItem
                      icon={items.temperature.icon}
                      className="text-[13px] font-medium text-white/85"
                    >
                      {items.temperature.text}
                    </WeatherItem>
                  )}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {items.windSpeed && (
                    <WeatherItem
                      icon={items.windSpeed.icon}
                      className="text-[13px] font-medium text-white/85"
                    >
                      {items.windSpeed.text}
                    </WeatherItem>
                  )}
                  {items.windDirection && (
                    <WeatherItem
                      icon={items.windDirection.icon}
                      className="text-[13px] font-medium text-white/85"
                    >
                      {items.windDirection.text}
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
  const items = weatherItems(weather);

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
            <div className="shrink-0">
              {weather ? (
                <div className="flex flex-col gap-y-2">
                  <div className="flex gap-x-5">
                    {items.symbol && (
                      <WeatherItem icon={items.symbol.icon}>
                        {items.symbol.text}
                      </WeatherItem>
                    )}
                    {items.temperature && (
                      <WeatherItem icon={items.temperature.icon}>
                        {items.temperature.text}
                      </WeatherItem>
                    )}
                  </div>
                  <div className="flex gap-x-5">
                    {items.windSpeed && (
                      <WeatherItem icon={items.windSpeed.icon}>
                        {items.windSpeed.text}
                      </WeatherItem>
                    )}
                    {items.windDirection && (
                      <WeatherItem icon={items.windDirection.icon}>
                        {items.windDirection.text}
                      </WeatherItem>
                    )}
                  </div>
                </div>
              ) : (
                race.courseCondition && (
                  <WeatherItem icon={Footprints}>
                    {race.courseCondition}
                  </WeatherItem>
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
  const { data, isPending, isError } = useQuery(QUERIES.race.getNextRace());
  const race = data ?? undefined;
  const weather = race?.weather;

  if (isError && !race) return null;

  const props = { isPending, race, weather };

  return variant === "stacked" ? (
    <NextRaceStacked {...props} />
  ) : (
    <NextRaceOverlay {...props} />
  );
}
