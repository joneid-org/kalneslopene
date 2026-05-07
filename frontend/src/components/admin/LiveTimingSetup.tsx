import { useQuery } from "@tanstack/react-query";
import {
  CalendarIcon,
  SearchIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  formatDDMonth,
  extractYear,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO, RunnerDTO } from "@/model/DTO.ts";

export function LiveTimingSetup({
  races,
  selectedRace,
  startList,
  onSelectRace,
  onStartListChange,
  onStart,
}: {
  races: RaceDTO[];
  selectedRace: RaceDTO | null;
  startList: RunnerDTO[];
  onSelectRace: (r: RaceDTO) => void;
  onStartListChange: (list: RunnerDTO[]) => void;
  onStart: () => void;
}) {
  const [search, setSearch] = useState("");

  const sortedRaces = [...races].sort((a, b) =>
    raceDateToSortKey(b.raceDate).localeCompare(raceDateToSortKey(a.raceDate)),
  );

  const { data: searchResults } = useQuery({
    ...QUERIES.runner.getAllRunners(search),
    enabled: search.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const startListUuids = new Set(startList.map((r) => r.uuid));

  const suggestions = (searchResults ?? []).filter(
    (r) => !startListUuids.has(r.uuid),
  );

  function addRunner(runner: RunnerDTO) {
    onStartListChange([...startList, runner]);
    setSearch("");
  }

  function removeRunner(uuid: string | undefined) {
    onStartListChange(startList.filter((r) => r.uuid !== uuid));
  }

  return (
    <div className="space-y-5">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarIcon className="size-4 text-primary" />
            Velg løp
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {sortedRaces.length === 0 && (
            <p className="text-sm text-muted-foreground italic p-4">
              Ingen tilgjengelige løp funnet.
            </p>
          )}
          <div className="divide-y">
            {sortedRaces.map((race) => {
              const isSelected = selectedRace?.uuid === race.uuid;
              const upcoming = !isPast(race);
              return (
                <button
                  key={race.uuid}
                  type="button"
                  onClick={() => onSelectRace(race)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary font-medium"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span>
                    {formatDDMonth(race.raceDate)}{" "}
                    <span className="text-muted-foreground font-normal">
                      {extractYear(race.raceDate)}
                    </span>
                  </span>
                  <Badge
                    variant="outline"
                    className={`text-xs ml-1 ${upcoming ? "border-green-400 text-green-700 dark:text-green-400" : "text-muted-foreground"}`}
                  >
                    {upcoming ? "Neste løp" : "Siste løp"}
                  </Badge>
                  {isSelected && (
                    <span className="ml-auto text-xs font-semibold text-primary">
                      Valgt
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserPlusIcon className="size-4 text-primary" />
            Startliste
            <Badge variant="secondary">{startList.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Søk og legg til løper..."
              className="pl-8"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {search.length > 0 && suggestions.length > 0 && (
            <div className="border rounded-md divide-y max-h-36 overflow-y-auto">
              {suggestions.map((r) => (
                <button
                  key={r.uuid}
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-muted text-left"
                  onClick={() => addRunner(r)}
                >
                  <span>{r.name}</span>
                  <span className="text-muted-foreground text-xs">
                    {r.gender}
                  </span>
                </button>
              ))}
            </div>
          )}
          {search.length > 0 &&
            (!searchResults || suggestions.length === 0) && (
              <p className="text-xs text-muted-foreground">Ingen treff.</p>
            )}

          <Separator />

          {startList.length === 0 ? (
            <p className="text-sm text-muted-foreground italic text-center py-2">
              Ingen løpere lagt til ennå.
            </p>
          ) : (
            <div className="space-y-1 max-h-52 overflow-y-auto">
              {startList.map((runner, i) => (
                <div
                  key={runner.uuid}
                  className="flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-muted/40 group"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground text-xs w-5 text-right tabular-nums">
                      {i + 1}.
                    </span>
                    <span className="font-medium">{runner.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {runner.gender}
                    </span>
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeRunner(runner.uuid)}
                  >
                    <UserMinusIcon className="size-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="ml-auto block gap-2"
        disabled={!selectedRace || startList.length === 0}
        onClick={onStart}
      >
        Gå til tidtaking
      </Button>
    </div>
  );
}
