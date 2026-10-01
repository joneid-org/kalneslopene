import { StatCard } from "@/components/Statistics/StatCard.tsx";
import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import { cn } from "@/lib/utils.ts";
import type { RaceStatisticsDTO } from "@/model/DTO.ts";

type Props = {
  statistics: RaceStatisticsDTO;
};

const COLUMNS = ["Løp", "Menn", "Kvinner", "Snitt", "Totalt"];
const TOTAL_STYLE = "font-display text-[15px] font-extrabold";

function Row({
  label,
  shortLabel,
  values,
  className,
  bold,
}: {
  label: string;
  shortLabel: string;
  values: number[];
  className?: string;
  bold?: boolean;
}) {
  return (
    <tr className={className}>
      <th
        scope="row"
        className={cn(
          "py-2.5 pr-2 text-left",
          bold ? TOTAL_STYLE : "font-semibold",
        )}
      >
        <span className="capitalize sm:hidden">{shortLabel}</span>
        <span className="hidden capitalize sm:inline">{label}</span>
      </th>
      {values.map((value, i) => (
        <td
          key={COLUMNS[i]}
          className={cn(
            "px-1 py-2.5 text-center tabular-nums",
            bold || i === values.length - 1
              ? TOTAL_STYLE
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
                className="px-1 pb-2 text-center font-semibold"
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
            bold
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
