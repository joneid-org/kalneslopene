import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { getDayMonthAndYear, getTimestamp, getYear } from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

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

export function RaceCalendar() {
  const { data: races = [] } = useQuery(QUERIES.race.getAllRaces);

  const allYears = Array.from(
    new Set(races.map((r) => getYear(r.raceDate))),
  ).sort((a, b) => b - a);

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedRace, setSelectedRace] = useState<RaceDTO | null>(null);

  const racesForYear = races
    .filter((r) => getYear(r.raceDate) === selectedYear)
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate));

  const pastDates = racesForYear
    .filter((r) => isPast(r))
    .map((r) => raceDateToDate(r.raceDate));
  const upcomingDates = racesForYear
    .filter((r) => !isPast(r))
    .map((r) => raceDateToDate(r.raceDate));

  const selectedDate = selectedRace
    ? raceDateToDate(selectedRace.raceDate)
    : undefined;

  function handleDayClick(day: Date) {
    const race = racesForYear.find((r) =>
      isSameDay(raceDateToDate(r.raceDate), day),
    );
    setSelectedRace(race ?? null);
  }

  function handleYearChange(year: number) {
    setSelectedYear(year);
    setMonth(new Date(year, 0));
    setSelectedRace(null);
  }

  const pastCount = pastDates.length;
  const upcomingCount = upcomingDates.length;

  return (
    <div className="page-content section-stack">
      <section className="space-y-1">
        <h1 className="page-title">Løpskalender</h1>
        <p className="text-muted-foreground text-sm">
          Oversikt over alle Torsdagsløp — klikk på en dato for å se detaljer.
        </p>
      </section>

      {/* Year selector */}
      <div className="flex flex-wrap gap-2">
        {allYears.map((year) => (
          <Button
            key={year}
            variant={selectedYear === year ? "default" : "outline"}
            size="sm"
            onClick={() => handleYearChange(year)}
          >
            {year}
          </Button>
        ))}
      </div>

      {racesForYear.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="gap-1">
            ✓ {pastCount} gjennomført
          </Badge>
          <Badge variant="outline" className="gap-1">
            ◷ {upcomingCount} kommende
          </Badge>
        </div>
      )}

      <Separator />

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Calendar */}
        <Card className="shrink-0">
          <CardContent className="p-0">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onDayClick={handleDayClick}
              modifiers={{
                past: pastDates,
                upcoming: upcomingDates,
              }}
              modifiersClassNames={{
                past: "bg-muted font-semibold text-foreground rounded-md",
                upcoming:
                  "bg-primary/15 font-semibold text-primary rounded-md ring-1 ring-primary/40",
              }}
              disabled={(day) =>
                !racesForYear.some((r) =>
                  isSameDay(raceDateToDate(r.raceDate), day),
                )
              }
              locale={{
                localize: {
                  day: (n: number) =>
                    ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"][n],
                  month: (n: number) =>
                    [
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
                    ][n],
                  ordinalNumber: (n: number) => `${n}.`,
                  era: () => "",
                  quarter: () => "",
                  dayPeriod: () => "",
                } as never,
                formatLong: {
                  date: () => "dd.MM.yyyy",
                  time: () => "HH:mm",
                  dateTime: () => "dd.MM.yyyy HH:mm",
                } as never,
                options: { weekStartsOn: 1, firstWeekContainsDate: 4 },
                code: "nb",
                match: {} as never,
                formatDistance: () => "",
                formatRelative: () => "",
              }}
            />
          </CardContent>
        </Card>

        {/* Detail panel */}
        <div className="flex-1 min-w-0">
          {selectedRace ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  {getDayMonthAndYear(selectedRace.raceDate)}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  kl. {getTimestamp(selectedRace.raceDate)}
                </p>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-4">
                {isPast(selectedRace) ? (
                  <>
                    <Badge variant="secondary">Gjennomført</Badge>
                    {selectedRace.uuid && (
                      <div>
                        <Link to={`/Resultater/${selectedRace.uuid}`}>
                          <Button className="gap-2">
                            Se resultater
                            <ChevronRight className="size-4" />
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                ) : (
                  <Badge>Kommende løp</Badge>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-10 text-center space-y-1">
                <p className="text-2xl">📅</p>
                <p className="text-sm text-muted-foreground">
                  Klikk på en dato i kalenderen for å se detaljer.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
