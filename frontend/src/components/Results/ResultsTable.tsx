import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { useMemo, useState, useSyncExternalStore } from "react";
import { ColumnVisibilityMenu } from "@/components/Results/ColumnVisibilityMenu.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { DESKTOP_ONLY_COLUMNS } from "@/lib/constants.ts";
import type { RowData } from "@/lib/utils.ts";

type ResultsTableProps = {
  title?: string;
  tableData: RowData[];
};

const MOBILE_QUERY = "(max-width: 767px)";

function subscribeMobile(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function useIsMobile() {
  return useSyncExternalStore(
    subscribeMobile,
    () => window.matchMedia(MOBILE_QUERY).matches,
  );
}

const numCell = ({ getValue }: CellContext<RowData, unknown>) => (
  <span className="tabular-nums">{String(getValue())}</span>
);

export default function ResultsTable({ tableData, title }: ResultsTableProps) {
  const isMobile = useIsMobile();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => Object.fromEntries(DESKTOP_ONLY_COLUMNS.map((c) => [c, !isMobile])),
  );
  const [lastIsMobile, setLastIsMobile] = useState(isMobile);
  if (lastIsMobile !== isMobile) {
    setLastIsMobile(isMobile);
    setColumnVisibility((prev) => {
      const updated = { ...prev };
      for (const col of DESKTOP_ONLY_COLUMNS) updated[col] = !isMobile;
      return updated;
    });
  }

  const columns: ColumnDef<RowData>[] = useMemo(
    () => [
      {
        accessorKey: "position",
        header: "#",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<number>()}</span>
        ),
        size: 24,
      },
      {
        accessorKey: "runnerName",
        header: "NAVN",
        cell: ({ getValue, row }) => (
          <span className="flex items-start gap-1 w-full">
            <span
              className={`inline-block size-1.5 rounded-full shrink-0 mt-0.75 ${row.original.gender === "Mann" ? "bg-blue-500" : "bg-red-500"}`}
            />
            <span className="leading-tight">{getValue<string>()}</span>
          </span>
        ),
        size: 90,
      },
      { accessorKey: "time", header: "TID", cell: numCell, size: 44 },
      { accessorKey: "pace", header: "MIN/KM", cell: numCell, size: 44 },
      { accessorKey: "yearBest", header: "ÅRSBESTE", cell: numCell, size: 44 },
      { accessorKey: "pr", header: "PERS", cell: numCell, size: 44 },
      { accessorKey: "races", header: "LØP", cell: numCell, size: 28 },
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

  return (
    <Card>
      <CardHeader className="py-3 md:py-4 px-4 md:px-6 pb-0">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-base font-semibold leading-tight">
            {title}
          </CardTitle>
          <ColumnVisibilityMenu
            table={table}
            columnVisibility={columnVisibility}
            setColumnVisibility={setColumnVisibility}
          />
        </div>
      </CardHeader>

      <CardContent className="p-0 mt-2">
        <Table className="text-[10px] sm:text-xs md:text-sm table-fixed w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="px-1 md:px-4 py-1 md:py-3 text-[9px] sm:text-xs whitespace-nowrap"
                    style={
                      header.column.columnDef.size
                        ? { width: header.column.columnDef.size }
                        : undefined
                    }
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
            {table.getRowModel().rows.map((row, i) => (
              <TableRow
                key={row.id}
                className={i % 2 === 1 ? "bg-muted/40" : ""}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`px-1 md:px-4 py-0.5 md:py-2.5 align-top${row.original.isPR && cell.column.id === "pr" ? " bg-secondary text-secondary-foreground font-semibold rounded" : ""}`}
                    style={
                      cell.column.id === "runnerName"
                        ? {
                            wordBreak: "break-word",
                            overflowWrap: "anywhere",
                            whiteSpace: "normal",
                          }
                        : { whiteSpace: "nowrap" }
                    }
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
