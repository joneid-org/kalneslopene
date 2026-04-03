import { PencilIcon, Trash2Icon, UserIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

export function RunnersCard({
  runners,
  search,
  onSearchChange,
  onEdit,
  onDelete,
}: {
  runners: RunnerDTO[];
  search: string;
  onSearchChange: (value: string) => void;
  onEdit: (runner: RunnerDTO) => void;
  onDelete: (runner: RunnerDTO) => void;
}) {
  return (
    <AdminCard
      icon={<UserIcon className="size-4 text-primary" />}
      title="Alle løpere"
      items={runners}
      columns={[
        { label: "Navn" },
        { label: "Kjønn" },
        { label: "", className: "w-20" },
      ]}
      emptyText="Ingen løpere funnet."
      headerExtra={
        <Input
          placeholder="Søk etter navn..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      }
      renderRow={(runner) => (
        <>
          <TableCell className="font-medium">{runner.name}</TableCell>
          <TableCell className="text-muted-foreground">
            {runner.gender}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1 justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => onEdit(runner)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(runner)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    />
  );
}
