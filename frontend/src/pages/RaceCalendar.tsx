import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Camera, CloudSun, Users } from "lucide-react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { WeatherLine } from "@/components/Weather/WeatherLine.tsx";
import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import {
  extractYear,
  formatTimeStamp,
  formatWeekdayDateFull,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import { cn, isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

const WEEKDAYS_SHORT = ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"];

function raceDateToDate(raceDate: unknown): Date {
  const iso = typeof raceDate === "string" ? raceDate : String(raceDate);
  const [datePart] = iso.split("T");
  const [y, m, d] = (datePart ?? "").split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

type MonthGroup = { month: number; races: RaceDTO[] };

function groupByMonth(races: RaceDTO[]): MonthGroup[] {
  const groups: MonthGroup[] = [];
  for (const race of races) {
    const month = raceDateToDate(race.raceDate).getMonth();
    const last = groups[groups.length - 1];
    if (last && last.month === month) last.races.push(race);
    else groups.push({ month, races: [race] });
  }
  return groups;
}

type RaceStatus = "past" | "next" | "upcoming";

function DateBadge({ date, status }: { date: Date; status: RaceStatus }) {
  return (
    <div
      className={cn(
        "flex size-14 shrink-0 flex-col items-center justify-center rounded-xl text-center",
        status === "next"
          ? "bg-brand text-brand-foreground"
          : status === "past"
            ? "bg-muted text-muted-foreground"
            : "border border-border bg-card text-foreground",
      )}
    >
      <span className="font-display text-xl font-black leading-none tabular-nums">
        {date.getDate()}
      </span>
      <span className="mt-0.5 text-[10px] font-bold uppercase tracking-wide opacity-80">
        {WEEKDAYS_SHORT[date.getDay()]}
      </span>
    </div>
  );
}

function StatItem({
  icon: Icon,
  children,
}: {
  icon: typeof Users;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
      <Icon className="size-4 shrink-0 text-primary" />
      {children}
    </span>
  );
}

function PastRaceRow({ race, date }: { race: RaceDTO; date: Date }) {
  const content = (
    <div className="flex min-w-0 flex-1 items-center gap-4 rounded-xl border bg-card p-3 transition-colors group-hover:bg-muted/50">
      <DateBadge date={date} status="past" />
      <div className="min-w-0 flex-1">
        <div className="font-display font-bold text-foreground">
          {formatWeekdayDateFull(race.raceDate)}
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1">
          <StatItem icon={Users}>{race.runnerCount} løpere</StatItem>
          {race.photos.length > 0 && (
            <StatItem icon={Camera}>{race.photos.length} bilder</StatItem>
          )}
          <WeatherLine
            weather={race.weather}
            courseCondition={race.courseCondition}
            className="text-muted-foreground"
          />
        </div>
      </div>
      <ArrowRight className="size-5 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </div>
  );

  if (!race.uuid) return content;
  return (
    <Link to={`/resultater/${race.uuid}`} className="group block">
      {content}
    </Link>
  );
}

function NextRaceRow({ race, date }: { race: RaceDTO; date: Date }) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-brand-ink p-3 shadow-[0_16px_30px_-16px_rgba(18,58,40,0.6)]">
      <DateBadge date={date} status="next" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wider text-brand-soft-foreground">
          Neste løp
        </div>
        <div className="mt-0.5 truncate font-display font-extrabold text-white">
          {formatWeekdayDateFull(race.raceDate)}
        </div>
        <div className="mt-0.5 text-sm text-white/70">
          Start kl. {formatTimeStamp(race.raceDate)}
        </div>
      </div>
    </div>
  );
}

function UpcomingRaceRow({ race, date }: { race: RaceDTO; date: Date }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-dashed bg-card p-3">
      <DateBadge date={date} status="upcoming" />
      <div className="min-w-0 flex-1">
        <div className="font-display font-bold text-foreground">
          {formatWeekdayDateFull(race.raceDate)}
        </div>
        <div className="mt-0.5 text-sm text-muted-foreground">
          Start kl. {formatTimeStamp(race.raceDate)}
        </div>
      </div>
    </div>
  );
}

function RaceRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-card p-3">
      <div className="size-14 shrink-0 animate-pulse rounded-xl bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-48 animate-pulse rounded bg-muted" />
        <div className="h-3 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function RaceCalendar() {
  const { data: races = [], isPending } = useQuery(QUERIES.race.getAllRaces());

  const currentYear = new Date().getFullYear();

  const seasonRaces = races
    .filter((r) => extractYear(r.raceDate) === currentYear)
    .sort((a, b) =>
      raceDateToSortKey(a.raceDate).localeCompare(
        raceDateToSortKey(b.raceDate),
      ),
    );

  const [pastRaces, upcomingRaces] = seasonRaces.partition(isPast);
  const completed = pastRaces.length;
  const total = seasonRaces.length;
  const nextRace = upcomingRaces[0];
  const upcomingGroups = groupByMonth(upcomingRaces);
  const pastGroups = groupByMonth(pastRaces);

  const renderGroups = (groups: MonthGroup[]) =>
    groups.map((group) => (
      <section key={group.month} className="space-y-3">
        <h2 className="text-label sticky top-0 z-10 -mx-3 bg-background/90 px-3 py-1 backdrop-blur sm:-mx-4 sm:px-4">
          {NORWEGIAN_MONTH_NAMES[group.month]}
        </h2>
        <div className="space-y-3">
          {group.races.map((race) => {
            const date = raceDateToDate(race.raceDate);
            if (race.uuid === nextRace?.uuid)
              return <NextRaceRow key={race.uuid} race={race} date={date} />;
            if (isPast(race))
              return (
                <PastRaceRow
                  key={race.uuid ?? date.toISOString()}
                  race={race}
                  date={date}
                />
              );
            return (
              <UpcomingRaceRow
                key={race.uuid ?? date.toISOString()}
                race={race}
                date={date}
              />
            );
          })}
        </div>
      </section>
    ));

  return (
    <div className="page-content-sm section-stack">
      <Link to="/" className="-mb-2 w-fit">
        <Button variant="ghost" size="sm" className="-ml-2 gap-1">
          <ArrowLeft className="size-4" />
          Tilbake
        </Button>
      </Link>

      <section className="space-y-3">
        <div className="space-y-1">
          <h1 className="page-title">Løpskalender {currentYear}</h1>
          <p className="text-muted-foreground text-sm">
            Torsdagsløpene denne sesongen. Trykk på et gjennomført løp for
            resultater.
          </p>
        </div>

        {total > 0 && (
          <div className="flex items-center gap-3">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand transition-all"
                style={{ width: `${(completed / total) * 100}%` }}
              />
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-muted-foreground">
              {completed} / {total} løp
            </span>
          </div>
        )}
      </section>

      {isPending ? (
        <div className="space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <RaceRowSkeleton key={i} />
          ))}
        </div>
      ) : total === 0 ? (
        <div className="empty-state">
          <CloudSun className="size-8" />
          <p>Ingen løp planlagt for sesongen ennå.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {upcomingRaces.length > 0 && (
            <div className="space-y-6">{renderGroups(upcomingGroups)}</div>
          )}

          {pastRaces.length > 0 && (
            <>
              <div className="flex items-center gap-3 pt-2">
                <div className="h-px flex-1 bg-border" />
                <span className="text-label shrink-0 text-muted-foreground">
                  Gjennomførte løp
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="space-y-6">{renderGroups(pastGroups)}</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
