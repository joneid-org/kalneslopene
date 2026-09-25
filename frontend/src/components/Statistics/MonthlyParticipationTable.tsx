import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import type { RaceStatisticsDTO } from "@/model/DTO.ts";

type Props = {
  statistics: RaceStatisticsDTO;
};

const numberCell = "text-right tabular-nums";

export function MonthlyParticipationTable({ statistics }: Props) {
  const { monthlyParticipation, totalParticipations } = statistics;
  if (monthlyParticipation.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-display text-base font-extrabold tracking-tight">
        Deltakelse per måned
      </h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Måned</TableHead>
            <TableHead className={numberCell}>Løp</TableHead>
            <TableHead className={numberCell}>Menn</TableHead>
            <TableHead className={numberCell}>Kvinner</TableHead>
            <TableHead className={numberCell}>Totalt</TableHead>
            <TableHead className={numberCell}>Snitt</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {monthlyParticipation.map((m) => (
            <TableRow key={m.month}>
              <TableCell className="font-medium capitalize">
                {NORWEGIAN_MONTH_NAMES[m.month - 1]}
              </TableCell>
              <TableCell className={numberCell}>{m.races}</TableCell>
              <TableCell className={numberCell}>{m.male}</TableCell>
              <TableCell className={numberCell}>{m.female}</TableCell>
              <TableCell className={numberCell}>{m.total}</TableCell>
              <TableCell className={numberCell}>
                {Math.round(m.averageRunnersPerRace)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow className="font-semibold">
            <TableCell>Totalt</TableCell>
            <TableCell className={numberCell}>
              {statistics.completedRaces}
            </TableCell>
            <TableCell className={numberCell}>
              {totalParticipations.male}
            </TableCell>
            <TableCell className={numberCell}>
              {totalParticipations.female}
            </TableCell>
            <TableCell className={numberCell}>
              {totalParticipations.male + totalParticipations.female}
            </TableCell>
            <TableCell className={numberCell}>
              {Math.round(statistics.averageRunnersPerRace)}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
