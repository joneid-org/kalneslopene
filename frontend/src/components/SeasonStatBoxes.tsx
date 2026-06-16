import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";

const CURRENT_YEAR = new Date().getFullYear();

export function SeasonStatBoxes() {
  const { data: yearStatistics } = useQuery(
    QUERIES.statistics.race(CURRENT_YEAR),
  );

  const stats = [
    {
      value: yearStatistics?.uniqueRunners.total,
      label: "deltakere totalt",
    },
    { value: yearStatistics?.uniqueRunners.female, label: "damer" },
    { value: yearStatistics?.uniqueRunners.male, label: "herrer" },
    { value: yearStatistics?.completedRaces, label: "løp gjennomført" },
    { value: yearStatistics?.upcomingRaces, label: "gjenstående løp" },
  ];

  return (
    <div className="rounded-xl bg-brand-ink p-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-md p-3 flex flex-col justify-between items-center text-center">
          <p className="text-xs text-white uppercase">Deltakerstatistikk</p>
          <p className="font-display text-xl text-white font-extrabold tracking-tight">
            Årets sesong i tall
          </p>
        </div>
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="bg-white rounded-md p-3 flex flex-col justify-between items-center text-center"
          >
            <p className="font-display text-xl font-black tabular-nums text-foreground">
              {value ?? "–"}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
