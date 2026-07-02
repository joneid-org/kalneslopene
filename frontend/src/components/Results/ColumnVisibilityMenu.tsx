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
import { COLUMN_LABELS } from "@/lib/constants.ts";

type Props = {
  columns: readonly string[];
  visibility: Record<string, boolean>;
  setVisibility: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
};

export function ColumnVisibilityMenu({
  columns,
  visibility,
  setVisibility,
}: Props) {
  const allVisible = columns.every((c) => visibility[c] ?? false);

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
          checked={allVisible}
          onCheckedChange={(val) =>
            setVisibility((prev) => ({
              ...prev,
              ...Object.fromEntries(columns.map((c) => [c, val])),
            }))
          }
        >
          Vis alle
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        {columns.map((id) => (
          <DropdownMenuCheckboxItem
            key={id}
            className="text-xs"
            checked={visibility[id] ?? false}
            onCheckedChange={(val) =>
              setVisibility((prev) => ({ ...prev, [id]: val }))
            }
          >
            {COLUMN_LABELS[id] ?? id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
