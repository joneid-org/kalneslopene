import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { WeatherLine } from "@/components/Weather/WeatherLine.tsx";
import {
  formatDate,
  formatDateFull,
  formatWeekdayDateFull,
} from "@/lib/timeUtils.ts";
import { cn } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type RaceSwitcherProps = {
  race: RaceDTO;
  previousRace: RaceDTO | null;
  nextRace: RaceDTO | null;
  path: string;
};

function SwitchButton({
  race,
  path,
  direction,
}: {
  race: RaceDTO | null;
  path: string;
  direction: "previous" | "next";
}) {
  const isPrev = direction === "previous";
  const Icon = isPrev ? ChevronLeft : ChevronRight;
  const className = cn(
    "inline-flex h-[38px] items-center gap-2 rounded-xl border bg-card px-2.5 text-sm font-semibold text-foreground/80 transition-colors md:px-4",
    race ? "hover:bg-accent" : "pointer-events-none opacity-45",
  );
  const label = race ? (
    <span className="hidden md:inline">{formatDate(race.raceDate)}</span>
  ) : null;

  const content = isPrev ? (
    <>
      <Icon className="size-4 shrink-0" />
      {label}
    </>
  ) : (
    <>
      {label}
      <Icon className="size-4 shrink-0" />
    </>
  );

  if (!race) {
    return (
      <span className={className} aria-hidden="true">
        {content}
      </span>
    );
  }
  return (
    <Link to={`${path}${race.uuid}`} className={className}>
      {content}
    </Link>
  );
}

export function RaceSwitcher({
  race,
  previousRace,
  nextRace,
  path,
}: RaceSwitcherProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <SwitchButton race={previousRace} path={path} direction="previous" />

      <div className="min-w-0 text-center">
        <div className="truncate font-display text-lg font-extrabold leading-tight tracking-tight md:text-2xl">
          <span className="md:hidden">{formatDateFull(race.raceDate)}</span>
          <span className="hidden md:inline">
            {formatWeekdayDateFull(race.raceDate)}
          </span>
        </div>
        <WeatherLine
          weather={race.weather}
          courseCondition={race.courseCondition}
          className="mt-0.5 text-xs text-muted-foreground md:text-sm"
        />
      </div>

      <SwitchButton race={nextRace} path={path} direction="next" />
    </div>
  );
}
