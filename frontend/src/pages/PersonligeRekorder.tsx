import { useQueries, useQuery } from "@tanstack/react-query";
import { MedalIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Input } from "@/components/ui/input.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { getPersonalRecords } from "@/lib/statisticsUtils.ts";

export function PersonligeRekorder() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState<"Alle" | "Mann" | "Kvinne">(
    "Alle",
  );

  const { data: runners } = useQuery(QUERIES.runner.getAllRunners());

  const raceHistoryResults = useQueries({
    queries: (runners ?? []).map((r) => ({
      ...QUERIES.runner.getAllRacesByRunner(r.uuid ?? ""),
      enabled: !!r.uuid,
    })),
  });

  const allRacesByRunner = useMemo(() => {
    const map: Record<string, import("@/model/DTO.ts").RaceRunnerDTO[]> = {};
    (runners ?? []).forEach((r, i) => {
      if (r.uuid && raceHistoryResults[i]?.data) {
        map[r.uuid] = raceHistoryResults[i].data ?? [];
      }
    });
    return map;
  }, [runners, raceHistoryResults]);

  const isLoading = raceHistoryResults.some((r) => r.isLoading);

  const records = useMemo(
    () => getPersonalRecords(allRacesByRunner),
    [allRacesByRunner],
  );

  const filtered = records.filter((r) => {
    const matchesSearch = r.runnerName
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGender = genderFilter === "Alle" || r.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  const medalColor = (index: number) => {
    if (index === 0) return "text-yellow-500";
    if (index === 1) return "text-slate-400";
    if (index === 2) return "text-amber-600";
    return "text-muted-foreground";
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <MedalIcon className="size-6 text-yellow-500" />
          Personlige rekorder
        </h1>
        <p className="text-sm text-muted-foreground">
          Beste tid per løper gjennom alle løp.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <Input
          placeholder="Søk etter navn..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-1">
          {(["Alle", "Mann", "Kvinne"] as const).map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGenderFilter(g)}
              className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                genderFilter === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Stats summary */}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-semibold text-foreground">
            {records.length}
          </span>{" "}
          løpere med rekord
        </span>
        <span>
          <span className="font-semibold text-foreground">
            {filtered.length}
          </span>{" "}
          vises
        </span>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Navn</TableHead>
              <TableHead className="hidden sm:table-cell">Kjønn</TableHead>
              <TableHead className="text-right font-semibold">
                Personlig rekord
              </TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Løp
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8 text-sm italic"
                >
                  Laster rekorder...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-muted-foreground py-8 text-sm italic"
                >
                  Ingen rekorder funnet.
                </TableCell>
              </TableRow>
            )}
            {!isLoading &&
              filtered.map((record) => {
                const globalIndex = records.findIndex(
                  (r) => r.runnerUuid === record.runnerUuid,
                );
                return (
                  <TableRow key={record.runnerUuid}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {globalIndex < 3 ? (
                          <MedalIcon
                            className={`size-4 ${medalColor(globalIndex)}`}
                          />
                        ) : (
                          <span className="tabular-nums text-muted-foreground text-sm w-4 text-center">
                            {globalIndex + 1}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {record.runnerName}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant="outline" className="text-xs">
                        {record.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right tabular-nums font-mono font-semibold">
                      {record.pr}
                    </TableCell>
                    <TableCell className="text-right tabular-nums text-muted-foreground hidden sm:table-cell">
                      {record.totalRaces}
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
