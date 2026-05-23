import { useQuery } from "@tanstack/react-query";
import { FilterIcon, TimerIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import StatBox from "@/components/StatBox.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  formatDateFull,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import { getYears } from "@/lib/utils.ts";

export default function RaceStatistics() {
  const [selectedYear, setSelectedYear] = useState<number | undefined>(
    undefined,
  );

  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const { data: allTimeStatistics } = useQuery(QUERIES.statistics.race());
  const { data: yearStatistics } = useQuery(
    QUERIES.statistics.race(selectedYear),
  );

  const availableYears = useMemo(() => getYears(races ?? []), [races]);
  const effectiveYear = selectedYear ?? availableYears[0];

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-semibold">Løpsstatistikk</h2>
        <div className="flex flex-wrap gap-2">
          {availableYears.map((y) => (
            <Button
              key={y}
              size="sm"
              variant={effectiveYear === y ? "default" : "outline"}
              onClick={() => setSelectedYear(y)}
            >
              {y}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox
          icon={UsersIcon}
          value={yearStatistics?.uniqueRunners.total}
          label="Unike løpere"
        />
        <StatBox
          icon={FilterIcon}
          value={yearStatistics?.averageRunnersPerRace?.toFixed(1) ?? "—"}
          label="Snitt deltakere"
        />
        <StatBox
          icon={TimerIcon}
          value={formatSecondsToTime(
            mapResultTimeToNumber(yearStatistics?.courseRecord?.resultTime),
          )}
          label="Årets raskeste tid"
        />
      </div>

      {allTimeStatistics?.courseRecord && (
        <Card className="bg-muted/30">
          <CardContent className="py-3 px-4 flex items-center gap-3">
            <TrophyIcon className="size-4 text-amber-500 shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-muted-foreground font-medium">
                Løyperekord
              </span>
              <p className="text-sm">
                <span className="font-semibold">
                  {formatSecondsToTime(
                    mapResultTimeToNumber(
                      allTimeStatistics.courseRecord.resultTime,
                    ),
                  )}
                </span>
                {" — "}
                {allTimeStatistics?.courseRecord.runner.name}
                <span className="text-muted-foreground">
                  {", "}
                  {formatDateFull(
                    allTimeStatistics?.courseRecord.race.raceDate,
                  )}
                </span>
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
