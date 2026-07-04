import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { ColumnVisibilityMenu } from "@/components/Results/ColumnVisibilityMenu.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { HIDEABLE_COLUMNS } from "@/lib/constants.ts";
import { cn, type RowData } from "@/lib/utils.ts";

type ResultsTableProps = {
  tableData: RowData[];
};

const rightAlignedColumns = new Set([
  "time",
  "pace",
  "yearBest",
  "pr",
  "races",
]);

function RankBadge({ rank }: { rank: number }) {
  if (rank > 3) {
    return (
      <span className="inline-flex w-7 justify-center font-display text-sm font-extrabold tabular-nums text-muted-foreground">
        {rank}
      </span>
    );
  }
  const tone =
    rank === 1
      ? "bg-brand text-brand-foreground"
      : rank === 2
        ? "bg-muted text-foreground"
        : "bg-brand-soft text-brand-soft-foreground";
  return (
    <span
      className={cn(
        "inline-flex size-7 items-center justify-center rounded-full font-display text-sm font-extrabold",
        tone,
      )}
    >
      {rank}
    </span>
  );
}

function PrBadge() {
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-brand px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-brand-foreground">
      Ny pers
    </span>
  );
}

type CardVisibility = {
  pace: boolean;
  yearBest: boolean;
  pr: boolean;
  races: boolean;
};

function ResultCard({
  row,
  visibility,
}: {
  row: RowData;
  visibility: CardVisibility;
}) {
  const details: { key: string; label?: string; value: string }[] = [];
  if (visibility.yearBest) {
    details.push({ key: "yearBest", label: "Årsbeste", value: row.yearBest });
  }
  if (visibility.pr) {
    details.push({ key: "pr", label: "Pers", value: row.pr });
  }
  if (visibility.races) {
    details.push({ key: "races", label: "Løp", value: String(row.races) });
  }
  const showPace = visibility.pace && !row.hideTime;

  return (
    <div className="flex items-center gap-3 rounded-[14px] border bg-card px-3 py-2.5">
      <RankBadge rank={row.position} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="min-w-0 truncate text-[15px] font-bold leading-tight">
            {row.runnerName}
          </span>
          {row.isPR && <PrBadge />}
        </div>
        {details.length > 0 && (
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] tabular-nums text-muted-foreground">
            {details.map((d) => (
              <span key={d.key} className="whitespace-nowrap">
                {d.label && <span className="font-medium">{d.label} </span>}
                {d.value}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end leading-tight">
        <span
          className={cn(
            "font-display font-extrabold tabular-nums",
            row.hideTime
              ? "text-sm font-semibold text-muted-foreground"
              : "text-lg",
          )}
        >
          {row.time}
        </span>
        {showPace && (
          <span className="text-xs tabular-nums text-muted-foreground">
            {row.pace} min/km
          </span>
        )}
      </div>
    </div>
  );
}

const numCell = ({ getValue }: CellContext<RowData, unknown>) => (
  <span className="tabular-nums text-muted-foreground">
    {String(getValue())}
  </span>
);

export default function ResultsTable({ tableData }: ResultsTableProps) {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    pace: true,
    yearBest: true,
    pr: true,
    races: true,
  });
  const [mobileVisibility, setMobileVisibility] = useState<
    Record<string, boolean>
  >({ pace: true, yearBest: false, pr: false, races: false });

  const columns: ColumnDef<RowData>[] = useMemo(
    () => [
      {
        accessorKey: "position",
        header: "#",
        enableHiding: false,
        cell: ({ getValue }) => <RankBadge rank={getValue<number>()} />,
      },
      {
        accessorKey: "runnerName",
        header: "Navn",
        enableHiding: false,
        cell: ({ getValue, row }) => (
          <span className="inline-flex items-center gap-2">
            <span className="font-semibold">{getValue<string>()}</span>
            {row.original.isPR && <PrBadge />}
          </span>
        ),
      },
      {
        accessorKey: "time",
        header: "Tid",
        enableHiding: false,
        cell: ({ getValue, row }) => (
          <span
            className={cn(
              "font-display font-bold tabular-nums",
              row.original.hideTime
                ? "font-semibold text-muted-foreground"
                : "text-foreground",
            )}
          >
            {getValue<string>()}
          </span>
        ),
      },
      { accessorKey: "pace", header: "Min/km", cell: numCell },
      { accessorKey: "yearBest", header: "Årsbeste", cell: numCell },
      { accessorKey: "pr", header: "Pers", cell: numCell },
      { accessorKey: "races", header: "Løp totalt", cell: numCell },
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const visibleRows = tableData;
  const visibleTableRows = table.getRowModel().rows;

  const cardVisibility: CardVisibility = {
    pace: mobileVisibility.pace ?? false,
    yearBest: mobileVisibility.yearBest ?? false,
    pr: mobileVisibility.pr ?? false,
    races: mobileVisibility.races ?? false,
  };

  return (
    <section>
      {/* Mobile — card list */}
      <div className="md:hidden">
        <div className="mb-2.5 flex items-center justify-between">
          <h2 className="font-display text-base font-extrabold tracking-tight">
            Resultatliste
          </h2>
          <ColumnVisibilityMenu
            columns={HIDEABLE_COLUMNS}
            visibility={mobileVisibility}
            setVisibility={setMobileVisibility}
          />
        </div>
        <div className="flex flex-col gap-2">
          {visibleRows.map((row) => (
            <ResultCard
              key={`${row.position}-${row.runnerName}`}
              row={row}
              visibility={cardVisibility}
            />
          ))}
        </div>
      </div>

      {/* Web — table */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-display text-lg font-extrabold tracking-tight">
            Resultatliste
          </h2>
          <ColumnVisibilityMenu
            columns={HIDEABLE_COLUMNS}
            visibility={columnVisibility}
            setVisibility={setColumnVisibility}
          />
        </div>

        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      "h-auto py-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 first:pl-6 last:pr-6",
                      rightAlignedColumns.has(header.column.id) && "text-right",
                    )}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {visibleTableRows.map((row, i) => (
              <TableRow
                key={row.id}
                className={cn(
                  "border-0 hover:bg-transparent",
                  i % 2 === 1 && "bg-muted/40",
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={cn(
                      "py-3 text-sm first:pl-6 last:pr-6",
                      rightAlignedColumns.has(cell.column.id) && "text-right",
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
