import { StatCard } from "@/components/Statistics/StatCard.tsx";
import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import type { RaceStatisticsDTO } from "@/model/DTO.ts";

type Props = {
  statistics: RaceStatisticsDTO;
};

function Legend() {
  return (
    <div className="flex gap-3 text-[11px] font-semibold text-muted-foreground">
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-primary" />
        Menn
      </span>
      <span className="flex items-center gap-1.5">
        <span className="size-2 rounded-full bg-brand" />
        Kvinner
      </span>
    </div>
  );
}

export function MonthlyParticipationList({ statistics }: Props) {
  const { monthlyParticipation, totalParticipations } = statistics;
  if (monthlyParticipation.length === 0) return null;

  const maxTotal = Math.max(...monthlyParticipation.map((m) => m.total), 1);

  return (
    <StatCard
      title="Deltakelse per måned"
      subtitle={`${statistics.completedRaces} løp · ${
        totalParticipations.male + totalParticipations.female
      } deltakelser · snitt ${Math.round(statistics.averageRunnersPerRace)}`}
      action={<Legend />}
    >
      <ul className="flex flex-col gap-3.5">
        {monthlyParticipation.map((m) => (
          <li key={m.month}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold capitalize">
                {NORWEGIAN_MONTH_NAMES[m.month - 1]}
              </span>
              <span className="font-display text-[17px] font-extrabold tabular-nums">
                {m.total}
              </span>
            </div>
            <div
              className="mt-1.5 flex h-2 overflow-hidden rounded-full bg-muted"
              role="img"
              aria-label={`${m.male} menn og ${m.female} kvinner`}
            >
              <div
                className="bg-primary"
                style={{ width: `${(m.male / maxTotal) * 100}%` }}
              />
              <div
                className="bg-brand"
                style={{ width: `${(m.female / maxTotal) * 100}%` }}
              />
            </div>
            <div className="mt-1 flex justify-between gap-3 text-xs tabular-nums text-muted-foreground">
              <span>
                {m.races} løp · snitt {Math.round(m.averageRunnersPerRace)}
              </span>
              <span>
                {m.male} M · {m.female} K
              </span>
            </div>
          </li>
        ))}
      </ul>
    </StatCard>
  );
}
