import { CalendarDays, CheckCircle2, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  getAvailableYears,
  getRacesByYear,
  getUpcomingRaces,
  type Race,
} from "@/data/mockdata.ts";

const NOW = new Date();
NOW.setHours(0, 0, 0, 0);

function isPast(race: Race) {
  return new Date(race.date) < NOW;
}

function monthLabel(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("nb-NO", {
    month: "long",
    year: "numeric",
  });
}

// Group an array of races by month label
function groupByMonth(raceList: Race[]): { month: string; races: Race[] }[] {
  const map = new Map<string, Race[]>();
  for (const race of raceList) {
    const key = monthLabel(race.date);
    const existing = map.get(key);
    if (existing) {
      existing.push(race);
    } else {
      map.set(key, [race]);
    }
  }
  return Array.from(map.entries()).map(([month, races]) => ({ month, races }));
}

function UpcomingRaceRow({ race, isNext }: { race: Race; isNext: boolean }) {
  const date = new Date(race.date);
  return (
    <li className="flex items-start gap-4 py-4 px-4 md:px-6">
      {/* Day bubble */}
      <div className="shrink-0 flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary">
        <span className="text-xl font-bold leading-none tabular-nums">
          {date.getDate()}
        </span>
        <span className="text-[10px] uppercase tracking-wide">
          {date.toLocaleDateString("nb-NO", { month: "short" })}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{race.name}</span>
          {isNext && (
            <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-100 text-green-700 border border-green-200">
              Neste
            </Badge>
          )}
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
            Uke {race.week}
          </Badge>
        </div>
        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-muted-foreground">
          {race.time && (
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {race.time}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {race.location}
          </span>
          <span>{race.distance}</span>
        </div>
      </div>
    </li>
  );
}

function PastRaceRow({ race }: { race: Race }) {
  const date = new Date(race.date);
  return (
    <li className="flex items-center gap-3 py-2.5 px-4 md:px-6 text-muted-foreground hover:bg-muted/40 transition-colors rounded">
      <CheckCircle2 className="size-3.5 shrink-0 text-muted-foreground/50" />
      <span className="text-xs tabular-nums w-6 text-center">
        {date.getDate()}.
      </span>
      <span className="text-sm flex-1 truncate">{race.name}</span>
      <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 shrink-0">
        Uke {race.week}
      </Badge>
      {race.participants > 0 && (
        <span className="text-xs shrink-0">{race.participants} del.</span>
      )}
    </li>
  );
}

export function Lopskalender() {
  const upcoming = getUpcomingRaces();
  const years = getAvailableYears(); // descending

  // Split each year's races into upcoming / past for the archive section
  const archiveYears = years
    .map((year) => {
      const all = getRacesByYear(year).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
      const past = all.filter(isPast);
      return { year, groups: groupByMonth(past) };
    })
    .filter((y) => y.groups.length > 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Løpskalender</h1>
        <p className="text-muted-foreground text-sm">
          Oversikt over kommende og tidligere torsdagsløp.
        </p>
      </div>

      {/* ── Upcoming ── */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-4 text-primary" />
          <h2 className="text-lg font-semibold">Kommende løp</h2>
          <Badge variant="secondary" className="text-xs">
            {upcoming.length} løp
          </Badge>
        </div>

        <Card>
          {upcoming.length === 0 ? (
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Ingen kommende løp registrert.
            </CardContent>
          ) : (
            <ul className="divide-y divide-border">
              {upcoming.map((race, i) => (
                <UpcomingRaceRow key={race.id} race={race} isNext={i === 0} />
              ))}
            </ul>
          )}
        </Card>
      </section>

      <Separator />

      {/* ── Archive ── */}
      <section className="space-y-8">
        <h2 className="text-lg font-semibold">Tidligere løp</h2>

        {archiveYears.map(({ year, groups }) => (
          <div key={year} className="space-y-4">
            <h3 className="text-base font-medium text-muted-foreground">
              {year}
            </h3>

            {groups.map(({ month, races }) => (
              <Card key={month}>
                <CardHeader className="py-3 px-4 md:px-6 border-b">
                  <CardTitle className="text-sm font-semibold capitalize">
                    {month}
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-0">
                  <ul>
                    {races.map((race) => (
                      <PastRaceRow key={race.id} race={race} />
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}
