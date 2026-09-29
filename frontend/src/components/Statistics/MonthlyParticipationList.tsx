import { StatCard } from "@/components/Statistics/StatCard.tsx";
import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import { cn } from "@/lib/utils.ts";
import type { RaceStatisticsDTO } from "@/model/DTO.ts";

type Props = {
  statistics: RaceStatisticsDTO;
};

const COLUMNS = ["Løp", "Menn", "Kvinner", "Snitt", "Totalt"];

function Row({
  label,
  shortLabel,
  values,
  className,
}: {
  label: string;
  shortLabel: string;
  values: number[];
  className?: string;
}) {
  return (
    <tr className={className}>
      <th scope="row" className="py-2.5 pr-2 text-left font-semibold">
        <span className="capitalize sm:hidden">{shortLabel}</span>
        <span className="hidden capitalize sm:inline">{label}</span>
      </th>
      {values.map((value, i) => (
        <td
          key={COLUMNS[i]}
          className={cn(
            "py-2.5 pl-2 text-right tabular-nums",
            i === values.length - 1
              ? "font-display text-[15px] font-extrabold"
              : "text-muted-foreground",
          )}
        >
          {value}
        </td>
      ))}
    </tr>
  );
}

export function MonthlyParticipationList({ statistics }: Props) {
  const { monthlyParticipation, totalParticipations } = statistics;
  if (monthlyParticipation.length === 0) return null;

  return (
    <StatCard title="Deltakelse per måned">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            <th scope="col" className="pb-2 text-left font-semibold">
              Måned
            </th>
            {COLUMNS.map((column) => (
              <th
                key={column}
                scope="col"
                className="pb-2 pl-2 text-right font-semibold"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {monthlyParticipation.map((m) => {
            const name = NORWEGIAN_MONTH_NAMES[m.month - 1];
            return (
              <Row
                key={m.month}
                label={name}
                shortLabel={name.slice(0, 3)}
                values={[
                  m.races,
                  m.male,
                  m.female,
                  Math.round(m.averageRunnersPerRace),
                  m.total,
                ]}
              />
            );
          })}
        </tbody>
        <tfoot>
          <Row
            className="border-t-2"
            label="Totalt"
            shortLabel="Totalt"
            values={[
              statistics.completedRaces,
              totalParticipations.male,
              totalParticipations.female,
              Math.round(statistics.averageRunnersPerRace),
              totalParticipations.male + totalParticipations.female,
            ]}
          />
        </tfoot>
      </table>
    </StatCard>
  );
}
