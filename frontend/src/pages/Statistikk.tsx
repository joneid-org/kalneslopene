import {
  ActivityIcon,
  CalendarIcon,
  FilterIcon,
  MapPinIcon,
  SearchIcon,
  TimerIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import RunnerTimeChart from "@/components/RunnerTimeChart.tsx";
import StatBox from "@/components/StatBox.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  getAllUniqueRunners,
  getAvailableYears,
  getRaceOverallStats,
  getRunnerDetailedStats,
  type RaceOverallStats,
  type RunnerDetailedStats,
} from "@/data/mockdata.ts";

const currentYear = new Date().getFullYear();

export function Statistikk() {
  const allRunners = getAllUniqueRunners();
  const availableYears = getAvailableYears().filter((y) => {
    // only years with actual past races
    return y <= currentYear;
  });

  // ── Race stats state ──
  const [raceYear, setRaceYear] = useState<number | undefined>(undefined);
  const raceStats: RaceOverallStats = getRaceOverallStats(raceYear);

  // ── Runner search state ──
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedRunner, setSelectedRunner] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [runnerYear, setRunnerYear] = useState<number | undefined>(undefined);

  const filtered = allRunners.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase()),
  );

  const stats: RunnerDetailedStats | null = selectedRunner
    ? getRunnerDetailedStats(selectedRunner.id, runnerYear)
    : null;

  const runnerYears = selectedRunner
    ? Object.keys(getRunnerDetailedStats(selectedRunner.id)?.seasonBest ?? {})
        .map(Number)
        .sort((a, b) => b - a)
    : [];

  const handleSelect = (id: string, name: string) => {
    setSelectedRunner({ id, name });
    setQuery(name);
    setRunnerYear(undefined);
    setOpen(false);
  };

  return (
    <div className="px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-3xl mx-auto space-y-10">
      <h1 className="font-bold">Statistikk</h1>

      {/* ══════════════════════════════════════════
          PART 1 — Race / overall statistics
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="font-semibold">Løpsstatistikk</h2>

          {/* Year filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={raceYear === undefined ? "default" : "outline"}
              onClick={() => setRaceYear(undefined)}
            >
              Alle år
            </Button>
            {availableYears.map((y) => (
              <Button
                key={y}
                size="sm"
                variant={raceYear === y ? "default" : "outline"}
                onClick={() => setRaceYear(y)}
              >
                {y}
              </Button>
            ))}
          </div>
        </div>

        {/* Stat boxes — 2 cols mobile, 3 cols sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <StatBox
            icon={CalendarIcon}
            value={raceStats.totalRaces}
            label="Løp arrangert"
            color="blue"
          />
          <StatBox
            icon={UsersIcon}
            value={raceStats.totalUniqueRunners}
            label="Unike løpere"
            color="green"
          />
          <StatBox
            icon={ActivityIcon}
            value={raceStats.totalFinishes}
            label="Fullføringer totalt"
            color="orange"
          />
          <StatBox
            icon={UsersIcon}
            value={raceStats.highestParticipation.count}
            label="Flest deltakere"
            color="amber"
          />
          <StatBox
            icon={FilterIcon}
            value={raceStats.averageParticipation}
            label="Snitt deltakere"
            color="blue"
          />
          <StatBox
            icon={TimerIcon}
            value={raceStats.bestTimeEver.time}
            label="Beste tid noensinne"
            color="green"
          />
        </div>

        {/* Best time detail */}
        {raceStats.bestTimeEver.runnerName !== "-" && (
          <Card className="bg-muted/30">
            <CardContent className="py-3 px-4 flex items-center gap-3">
              <TrophyIcon className="size-4 text-amber-500 shrink-0" />
              <p className="text-sm">
                <span className="font-semibold">
                  {raceStats.bestTimeEver.time}
                </span>
                {" — "}
                {raceStats.bestTimeEver.runnerName}
                {raceStats.bestTimeEver.race && (
                  <span className="text-muted-foreground">
                    {", uke "}
                    {raceStats.bestTimeEver.race.week}{" "}
                    {new Date(raceStats.bestTimeEver.race.date).getFullYear()}
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <Separator />

      {/* ══════════════════════════════════════════
          PART 2 — Runner specific statistics
      ══════════════════════════════════════════ */}
      <section className="space-y-4">
        <h2 className="font-semibold">Løperstatistikk</h2>

        {/* Search */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <SearchIcon className="size-4 text-primary" />
              Søk etter løper
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Command className="border rounded-lg" shouldFilter={false}>
              <CommandInput
                placeholder="Skriv et navn..."
                value={query}
                onValueChange={(val) => {
                  setQuery(val);
                  setOpen(val.length > 0);
                }}
                onFocus={() => setOpen(query.length > 0)}
              />
              {open && (
                <CommandList>
                  <CommandEmpty>Ingen løpere funnet.</CommandEmpty>
                  <CommandGroup>
                    {filtered.map((runner) => (
                      <CommandItem
                        key={runner.id}
                        value={runner.id}
                        onSelect={() => handleSelect(runner.id, runner.name)}
                      >
                        {runner.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              )}
            </Command>
          </CardContent>
        </Card>

        {/* Runner stats */}
        {stats && (
          <div className="space-y-4">
            {/* Runner header + season filter */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <CardTitle className="text-base">
                      {stats.runnerName}
                    </CardTitle>
                    <div className="flex gap-2 mt-1.5">
                      <Badge variant="secondary">{stats.ageGroup}</Badge>
                      <Badge variant="secondary">
                        {stats.gender === "M" ? "Mann" : "Kvinne"}
                      </Badge>
                    </div>
                  </div>

                  {/* Season filter */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant={runnerYear === undefined ? "default" : "outline"}
                      onClick={() => setRunnerYear(undefined)}
                    >
                      Alle
                    </Button>
                    {runnerYears.map((y) => (
                      <Button
                        key={y}
                        size="sm"
                        variant={runnerYear === y ? "default" : "outline"}
                        onClick={() => setRunnerYear(y)}
                      >
                        {y}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Runner stat boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatBox
                icon={ActivityIcon}
                value={stats.totalRaces}
                label="Løp fullført"
                color="blue"
              />
              <StatBox
                icon={TimerIcon}
                value={stats.pr}
                label="Personlig rekord"
                color="green"
              />
              <StatBox
                icon={TrophyIcon}
                value={stats.wins}
                label="Seire"
                color="amber"
              />
              <StatBox
                icon={MapPinIcon}
                value={`${stats.totalDistanceKm} km`}
                label="Total distanse"
                color="orange"
              />
            </div>

            {/* Time development chart */}
            <RunnerTimeChart
              runnerId={stats.runnerId}
              availableYears={runnerYears}
            />

            {/* Season bests */}
            {Object.keys(stats.seasonBest).length > 1 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CalendarIcon className="size-4 text-primary" />
                    Sesongbeste
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-border">
                    {Object.entries(stats.seasonBest)
                      .sort(([a], [b]) => Number(b) - Number(a))
                      .map(([year, time]) => (
                        <li
                          key={year}
                          className="flex items-center justify-between px-6 py-2.5"
                        >
                          <span className="text-sm font-medium">{year}</span>
                          <span className="text-sm tabular-nums font-mono">
                            {time}
                          </span>
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Race history */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ActivityIcon className="size-4 text-primary" />
                  Løpshistorikk
                  {runnerYear && (
                    <Badge variant="secondary" className="ml-1">
                      {runnerYear}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {stats.raceHistory.length === 0 ? (
                  <p className="text-sm text-muted-foreground px-6 py-4">
                    Ingen løp registrert for valgt sesong.
                  </p>
                ) : (
                  <ul className="divide-y divide-border">
                    {stats.raceHistory.map(({ race, result }) => (
                      <li
                        key={result.id}
                        className="flex items-center justify-between px-6 py-3 gap-4"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium">
                            {new Date(race.date).toLocaleDateString("nb-NO", {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Uke {race.week} · {race.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm tabular-nums font-mono">
                            {result.time}
                          </span>
                          <Badge
                            variant={
                              result.position === 1 ? "default" : "secondary"
                            }
                            className="w-10 justify-center"
                          >
                            #{result.position}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </section>
    </div>
  );
}
