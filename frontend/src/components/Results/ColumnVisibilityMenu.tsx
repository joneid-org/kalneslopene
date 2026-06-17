import type { Table, VisibilityState } from "@tanstack/react-table";
import { ListFilter } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { COLUMN_LABELS, DESKTOP_ONLY_COLUMNS } from "@/lib/constants.ts";

type Props<T> = {
  table: Table<T>;
  columnVisibility: VisibilityState;
  setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
};

export function ColumnVisibilityMenu<T>({
  table,
  columnVisibility,
  setColumnVisibility,
}: Props<T>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-9 gap-2 rounded-[11px] text-[13px] font-semibold"
        >
          <ListFilter className="size-3.5" />
          Filtrer &amp; kolonner
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel className="text-xs">Vis kolonner</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          className="text-xs font-semibold"
          checked={DESKTOP_ONLY_COLUMNS.every((c) => columnVisibility[c])}
          onCheckedChange={(val) =>
            setColumnVisibility((prev) => ({
              ...prev,
              ...Object.fromEntries(DESKTOP_ONLY_COLUMNS.map((c) => [c, val])),
            }))
          }
        >
          Vis alle
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {table.getAllColumns().flatMap((col) =>
          col.getCanHide()
            ? [
                <DropdownMenuCheckboxItem
                  key={col.id}
                  className="text-xs"
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(val)}
                >
                  {COLUMN_LABELS[col.id] ?? col.id}
                </DropdownMenuCheckboxItem>,
              ]
            : [],
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
