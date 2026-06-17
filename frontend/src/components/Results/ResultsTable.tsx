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
import { cn, type RowData } from "@/lib/utils.ts";

type ResultsTableProps = {
  tableData: RowData[];
};

const VISIBLE_COUNT = 8;

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

function ResultCard({ row }: { row: RowData }) {
  return (
    <div className="flex items-center gap-3 rounded-[14px] border bg-card px-3 py-2.5">
      <RankBadge rank={row.position} />
      <div className="min-w-0 flex-1">
        <div className="truncate text-[15px] font-bold leading-tight">
          {row.runnerName}
        </div>
        {!row.hideTime && (
          <div className="text-xs tabular-nums text-muted-foreground">
            {row.pace} min/km
          </div>
        )}
      </div>
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
    </div>
  );
}

const numCell = ({ getValue }: CellContext<RowData, unknown>) => (
  <span className="tabular-nums text-muted-foreground">
    {String(getValue())}
  </span>
);

export default function ResultsTable({ tableData }: ResultsTableProps) {
  const [expanded, setExpanded] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    yearBest: false,
    pr: false,
  });

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
        cell: ({ getValue }) => (
          <span className="font-semibold">{getValue<string>()}</span>
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

  const total = tableData.length;
  const visibleRows = expanded ? tableData : tableData.slice(0, VISIBLE_COUNT);
  const tableRows = table.getRowModel().rows;
  const visibleTableRows = expanded
    ? tableRows
    : tableRows.slice(0, VISIBLE_COUNT);
  const hasMore = total > VISIBLE_COUNT;
  const toggleLabel = expanded ? "Vis færre" : `Vis alle ${total} resultater`;

  return (
    <section>
      {/* Mobile — card list */}
      <div className="md:hidden">
        <h2 className="mb-2.5 font-display text-base font-extrabold tracking-tight">
          Resultatliste
        </h2>
        <div className="flex flex-col gap-2">
          {visibleRows.map((row) => (
            <ResultCard key={`${row.position}-${row.runnerName}`} row={row} />
          ))}
        </div>
        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-2.5 h-11 w-full rounded-[13px] bg-secondary text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {toggleLabel}
          </button>
        )}
      </div>

      {/* Web — table */}
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm md:block">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="font-display text-lg font-extrabold tracking-tight">
            Resultatliste
          </h2>
          <ColumnVisibilityMenu
            table={table}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
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

        {hasMore && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="h-[50px] w-full border-t bg-background text-sm font-bold text-primary transition-colors hover:bg-accent"
          >
            {toggleLabel}
          </button>
        )}
      </div>
    </section>
  );
}
