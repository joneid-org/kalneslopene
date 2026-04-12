import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { COLUMN_LABELS, DESKTOP_ONLY_COLUMNS } from "@/lib/constants.ts";
import type { RowData } from "@/lib/utils.ts";

type ResultsTableProps = {
  title?: string;
  tableData: RowData[];
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function ResultsTable({ tableData, title }: ResultsTableProps) {
  const isMobile = useIsMobile();

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      Object.fromEntries(
        DESKTOP_ONLY_COLUMNS.map((c) => [c, window.innerWidth >= 768]),
      ),
  );

  useEffect(() => {
    setColumnVisibility((prev) => {
      const updated = { ...prev };
      for (const col of DESKTOP_ONLY_COLUMNS) {
        updated[col] = !isMobile;
      }
      return updated;
    });
  }, [isMobile]);

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
              className={`inline-block size-1.5 rounded-full shrink-0 mt-[3px] ${row.original.gender === "Mann" ? "bg-blue-500" : "bg-red-500"}`}
            />
            <span
              className="leading-tight"
              style={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                whiteSpace: "normal",
              }}
            >
              {getValue<string>()}
            </span>
          </span>
        ),
        size: 90,
      },
      {
        accessorKey: "time",
        header: "TID",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
        size: 44,
      },
      {
        accessorKey: "pace",
        header: "MIN/KM",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
        size: 44,
      },
      {
        accessorKey: "yearBest",
        header: "ÅRSBESTE",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
        size: 44,
      },
      {
        accessorKey: "pr",
        header: "PERS",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
        size: 44,
      },
      {
        accessorKey: "races",
        header: "LØP",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
        size: 28,
      },
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
          <div className="flex items-center gap-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs gap-1.5 h-7 md:h-9 md:px-3"
                >
                  <SlidersHorizontal className="size-3.5 md:size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuLabel className="text-xs">
                  Vis kolonner
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  className="text-xs font-semibold"
                  checked={DESKTOP_ONLY_COLUMNS.every(
                    (c) => columnVisibility[c] === true,
                  )}
                  onCheckedChange={(val) => {
                    setColumnVisibility((prev) => ({
                      ...prev,
                      ...Object.fromEntries(
                        DESKTOP_ONLY_COLUMNS.map((c) => [c, val]),
                      ),
                    }));
                  }}
                >
                  Vis alle
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((col) => col.getCanHide())
                  .map((col) => (
                    <DropdownMenuCheckboxItem
                      key={col.id}
                      className="text-xs"
                      checked={col.getIsVisible()}
                      onCheckedChange={(val) => col.toggleVisibility(val)}
                    >
                      {COLUMN_LABELS[col.id] ?? col.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`px-1 md:px-4 py-0.5 md:py-2.5 align-top${row.original.isPR && cell.column.id === "pr" ? " bg-emerald-100 text-emerald-700 font-semibold rounded" : ""}`}
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
