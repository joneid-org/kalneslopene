import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Users,
} from "lucide-react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { useState } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { formatTimeStamp } from "@/lib/timeUtils.ts";
import { cn, isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const WEEKDAYS = ["Man", "Tir", "Ons", "Tor", "Fre", "Lør", "Søn"];
const MONTHS = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function raceDateToDate(raceDate: unknown): Date {
  const iso = typeof raceDate === "string" ? raceDate : String(raceDate);
  const [datePart] = iso.split("T");
  const [y, m, d] = (datePart ?? "").split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

type CalendarCell = { date: Date; inMonth: boolean };

function getCalendarDays(year: number, month: number): CalendarCell[] {
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: CalendarCell[] = [];
  for (let i = startOffset; i > 0; i--) {
    cells.push({ date: new Date(year, month, 1 - i), inMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(year, month, d), inMonth: true });
  }
  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      inMonth: false,
    });
  }
  return cells;
}

function PastRaceTooltip({ race, day }: { race: RaceDTO; day: Date }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link to={`/Resultater/${race.uuid}`} className="block h-full">
          <div className="flex flex-col h-full p-1.5 rounded-md text-left transition-colors bg-muted/60 border border-border hover:bg-muted">
            <span className="text-base font-semibold leading-none">
              {day.getDate()}
            </span>
            <span className="text-xs mt-1 text-muted-foreground hidden sm:block">
              kl. {formatTimeStamp(race.raceDate)}
            </span>
            <span className="mt-auto text-xs font-medium text-primary underline-offset-2 hover:underline hidden sm:block">
              Resultater →
            </span>
          </div>
        </Link>
      </TooltipTrigger>
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          side="right"
          align="start"
          sideOffset={0}
          className="group z-50 -translate-y-full"
        >
          <div className="w-52 origin-bottom-left animate-in rounded-md border bg-popover p-3 text-popover-foreground shadow-md fade-in-0 zoom-in-95 group-data-[state=closed]:animate-out group-data-[state=closed]:fade-out-0 group-data-[state=closed]:zoom-out-95">
            <p className="font-semibold text-sm">
              {day.getDate()}. {MONTHS[day.getMonth()].toLowerCase()}{" "}
              {day.getFullYear()}
            </p>
            <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Users className="size-4 shrink-0 text-primary" />
                {race.runnerCount} løpere
              </p>
              {race.photos.length > 0 && (
                <p className="flex items-center gap-2">
                  <Camera className="size-4 shrink-0 text-primary" />
                  {race.photos.length} bilder
                </p>
              )}
              {race.weather && (
                <p className="flex items-center gap-2">
                  <CloudSun className="size-4 shrink-0 text-primary" />
                  {race.weather}
                </p>
              )}
            </div>
          </div>
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    </Tooltip>
  );
}

export function RaceCalendar() {
  const { data: races = [] } = useQuery(QUERIES.race.getAllRaces());

  const now = new Date();
  const currentYear = now.getFullYear();
  const [month, setMonth] = useState(now.getMonth());

  // Only show current season — clamp navigation to current year
  const minMonth = 0;
  const maxMonth = 11;

  const raceMap = new Map<string, RaceDTO>();
  for (const race of races.filter(
    (r) => raceDateToDate(r.raceDate).getFullYear() === currentYear,
  )) {
    const d = raceDateToDate(race.raceDate);
    raceMap.set(`${d.getMonth()}-${d.getDate()}`, race);
  }

  function prevMonth() {
    setMonth((m) => Math.max(minMonth, m - 1));
  }

  function nextMonth() {
    setMonth((m) => Math.min(maxMonth, m + 1));
  }

  const cells = getCalendarDays(currentYear, month);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="page-content section-stack">
        <Link to="/" className="-mb-2">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2">
            <ArrowLeft className="size-4" />
            Tilbake
          </Button>
        </Link>

        <section className="space-y-1">
          <h1 className="page-title">Løpskalender {currentYear}</h1>
          <p className="text-muted-foreground text-sm">
            Oversikt over Torsdagsløpene denne sesongen. Hold over et
            gjennomført løp for detaljer.
          </p>
        </section>

        {/* Calendar */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          {/* Month navigation */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevMonth}
              disabled={month === minMonth}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <h2 className="font-semibold text-base">
              {MONTHS[month]} {currentYear}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextMonth}
              disabled={month === maxMonth}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b">
            {WEEKDAYS.map((wd) => (
              <div
                key={wd}
                className="py-2 text-center text-sm font-medium text-muted-foreground"
              >
                {wd}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {cells.map(({ date, inMonth }) => {
              const race = inMonth
                ? raceMap.get(`${date.getMonth()}-${date.getDate()}`)
                : undefined;
              const isToday = inMonth && isSameDay(date, now);
              const past = race ? isPast(race) : false;

              return (
                <div
                  key={date.toISOString()}
                  className={cn(
                    "min-h-16 sm:min-h-20 border-b border-r p-1",
                    "[&:nth-child(7n)]:border-r-0",
                    !inMonth && "bg-muted/20",
                  )}
                >
                  {inMonth && !race && (
                    <span
                      className={cn(
                        "text-base leading-none p-1 inline-flex items-center justify-center size-8 rounded-full",
                        isToday
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-muted-foreground",
                      )}
                    >
                      {date.getDate()}
                    </span>
                  )}
                  {inMonth && race && past && race.uuid && (
                    <PastRaceTooltip race={race} day={date} />
                  )}
                  {inMonth && race && !past && (
                    <div className="flex flex-col h-full p-1.5 rounded-md text-left bg-primary text-primary-foreground shadow-sm">
                      <span className="text-base font-semibold leading-none">
                        {date.getDate()}
                      </span>
                      <span className="text-xs mt-1 text-primary-foreground/70 hidden sm:block">
                        kl. {formatTimeStamp(race.raceDate)}
                      </span>
                      <span className="mt-auto text-xs font-semibold text-primary-foreground/80 hidden sm:block">
                        Kommende
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
