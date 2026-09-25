import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { RunnerDTO, TopParticipantDTO } from "@/model/DTO.ts";

type Props = {
  participants: TopParticipantDTO[];
  onSelectRunner: (runner: RunnerDTO) => void;
};

export function TopParticipantsTable({ participants, onSelectRunner }: Props) {
  if (participants.length === 0) return null;

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-3 font-display text-base font-extrabold tracking-tight">
        Topp 10 deltakelse
      </h3>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10">#</TableHead>
            <TableHead>Navn</TableHead>
            <TableHead className="text-right">Løp</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {participants.map((p) => (
            <TableRow key={p.runner.uuid}>
              <TableCell className="tabular-nums text-muted-foreground">
                {participants.findIndex((other) => other.races === p.races) + 1}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  onClick={() => onSelectRunner(p.runner)}
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  {p.runner.name}
                </button>
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {p.races}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
