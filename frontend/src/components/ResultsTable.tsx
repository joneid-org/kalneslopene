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
import type { Race, Result } from "../data/mockdata.ts";

const COLUMN_LABELS: Record<string, string> = {
  position: "#",
  runnerName: "Navn",
  time: "Resultat",
  races: "Løp",
  pace: "min/km",
  pr: "PR",
  yearBest: "Årsbeste",
};

const DESKTOP_ONLY_COLUMNS = ["races", "pace", "yearBest"];

export type RowData = Result & {
  races: number;
  pace: string;
  pr: string;
  yearBest: string;
};

type ResultsTableProps = {
  tableData: RowData[];
  title: string;
  race: Race | null;
  year?: number;
  week?: number;
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
        size: 36,
      },
      {
        accessorKey: "runnerName",
        header: "Navn",
        cell: ({ getValue, row }) => (
          <span className="flex items-center gap-1.5">
            <span
              className={`inline-block size-2 rounded-full shrink-0 ${row.original.gender === "M" ? "bg-blue-500" : "bg-red-500"}`}
            />
            <span className="block truncate max-w-32.5">
              {getValue<string>()}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "time",
        header: "Resultat",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "races",
        header: "Løp",
        size: 44,
      },
      {
        accessorKey: "pace",
        header: "min/km",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "pr",
        header: "PR",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "yearBest",
        header: "Årsbeste",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
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
        <div className="overflow-x-auto">
          <Table className="text-xs sm:text-sm md:text-base">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap"
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
                      className="px-2 md:px-4 py-1.5 md:py-2.5"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
