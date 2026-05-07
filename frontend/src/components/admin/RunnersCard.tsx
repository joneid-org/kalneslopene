import { UserIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { RowActions } from "@/components/admin/RowActions.tsx";
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
          <RowActions
            onEdit={() => onEdit(runner)}
            onDelete={() => onDelete(runner)}
          />
        </>
      )}
    />
  );
}
