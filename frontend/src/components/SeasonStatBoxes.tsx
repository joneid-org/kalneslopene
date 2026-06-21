import {useQuery} from "@tanstack/react-query";
import {QUERIES} from "@/api/queries.ts";

const CURRENT_YEAR = new Date().getFullYear();

export function SeasonStatBoxes() {
  const { data: yearStatistics } = useQuery(
    QUERIES.statistics.race(CURRENT_YEAR),
  );

  const stats = [
    {
      value: yearStatistics?.uniqueRunners.total,
      label: "Deltakere totalt",
      shortLabel: "Deltakere",
    },
    {
      value: yearStatistics?.averageRunnersPerRace.toFixed(2),
      label: "Snittdeltakelse",
      shortLabel: "Snittdeltakelse",
    },
    {
      value: yearStatistics?.uniqueRunners.female,
      label: "Damer",
      shortLabel: "Damer",
    },
    {
      value: yearStatistics?.uniqueRunners.male,
      label: "Herrer",
      shortLabel: "Herrer",
    },
    {
      value: yearStatistics?.completedRaces,
      label: "Løp gjennomført",
      shortLabel: "Gjennomført",
    },
    {
      value: yearStatistics?.upcomingRaces,
      label: "Gjenstående løp",
      shortLabel: "Igjen",
      accent: true,
    },
  ];

  return (
    <div className="rounded-2xl bg-brand-ink p-4 sm:p-7">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <span className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
          Deltakerstatistikk
        </span>
        <h2 className="font-display text-base sm:text-2xl text-white font-extrabold tracking-tight">
          Årets sesong i tall
        </h2>
        <span className="sm:hidden text-[10px] font-bold uppercase tracking-wider text-white/55">
          {CURRENT_YEAR}
        </span>
      </div>
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
        {stats.map(({ value, label, shortLabel, accent }) => (
          <div
            key={label}
            className={`rounded-xl p-2.5 sm:p-4 text-center ${
              accent ? "bg-brand" : "bg-white/[0.07]"
            }`}
          >
            <p
              className={`font-display text-[22px] sm:text-3xl font-extrabold tabular-nums leading-none ${
                accent ? "text-brand-foreground" : "text-white"
              }`}
            >
              {value ?? "–"}
            </p>
            <p
              className={`text-[10px] sm:text-[11px] uppercase tracking-wide mt-1.5 sm:mt-2 ${
                accent
                  ? "text-brand-foreground/80 font-bold"
                  : "text-white/70 font-semibold"
              }`}
            >
              <span className="sm:hidden">{shortLabel}</span>
              <span className="hidden sm:inline">{label}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
