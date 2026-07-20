import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
import { AttendanceChart } from "@/components/Statistics/AttendanceChart.tsx";
import { StatTile } from "@/components/StatTile.tsx";
import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import { getYears, isPast } from "@/lib/utils.ts";

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

  const yearRaces = useMemo(
    () =>
      (races ?? [])
        .filter((r) => isPast(r) && extractYear(r.raceDate) === effectiveYear)
        .sort((a, b) =>
          raceDateToSortKey(a.raceDate).localeCompare(
            raceDateToSortKey(b.raceDate),
          ),
        ),
    [races, effectiveYear],
  );

  const recordMale = allTimeStatistics?.courseRecordMale;
  const recordFemale = allTimeStatistics?.courseRecordFemale;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-extrabold tracking-tight md:text-2xl">
        Løpsstatistikk
      </h2>

      {(recordMale || recordFemale) && (
        <div className="flex items-center gap-4 rounded-2xl bg-brand-ink p-4 text-white md:p-5">
          <div className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-brand text-brand-foreground md:size-12">
            <Trophy className="size-5 md:size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/60">
              Løyperekord
            </div>
            <div className="mt-1 flex flex-col gap-1">
              {recordMale && (
                <div className="truncate">
                  <span className="font-display text-lg font-extrabold tabular-nums md:text-xl">
                    {formatSecondsToTime(
                      mapResultTimeToNumber(recordMale.resultTime),
                    )}
                  </span>
                  <span className="text-sm">
                    {" "}
                    — {recordMale.runner.name} - Menn
                  </span>
                </div>
              )}
              {recordFemale && (
                <div className="truncate">
                  <span className="font-display text-lg font-extrabold tabular-nums md:text-xl">
                    {formatSecondsToTime(
                      mapResultTimeToNumber(recordFemale.resultTime),
                    )}
                  </span>
                  <span className="text-sm">
                    {" "}
                    — {recordFemale.runner.name} - Kvinner
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {availableYears.length > 0 && (
        <div className="-mx-1 overflow-x-auto px-1 py-0.5">
          <SegmentedControl
            fullWidth
            options={availableYears.map((y) => ({
              label: String(y),
              value: y,
            }))}
            value={effectiveYear}
            onChange={setSelectedYear}
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 md:gap-3">
        <StatTile
          value={yearStatistics?.uniqueRunners.total}
          label="Unike løpere"
        />
        <StatTile
          value={
            yearStatistics?.averageRunnersPerRace != null
              ? Math.round(yearStatistics.averageRunnersPerRace)
              : undefined
          }
          label="Snitt frammøte"
        />
        <StatTile
          value={formatSecondsToTime(
            mapResultTimeToNumber(yearStatistics?.courseRecord?.resultTime),
          )}
          label="Raskeste tid"
          tone="primary"
        />
      </div>

      <div>
        <AttendanceChart races={yearRaces} />
      </div>
    </section>
  );
}
