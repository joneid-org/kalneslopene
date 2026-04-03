import { PencilIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import type { OrganizerDTO } from "@/model/DTO.ts";

export function OrganizersCard({
  organizers,
  onEdit,
  onDelete,
}: {
  organizers: OrganizerDTO[];
  onEdit: (organizer: OrganizerDTO) => void;
  onDelete: (organizer: OrganizerDTO) => void;
}) {
  return (
    <AdminCard
      icon={<UsersIcon className="size-4 text-primary" />}
      title="Alle organisatorer"
      items={organizers}
      columns={[
        { label: "Navn" },
        { label: "Initialer" },
        { label: "Ansvarsområder", className: "hidden sm:table-cell" },
        { label: "Kontakt", className: "hidden sm:table-cell" },
        { label: "", className: "w-20" },
      ]}
      emptyText="Ingen organisatorer registrert."
      renderRow={(org) => (
        <>
          <TableCell className="font-medium">
            {org.name}
            {org.contactPerson && (
              <Badge variant="outline" className="ml-2 text-xs">
                Kontakt
              </Badge>
            )}
          </TableCell>
          <TableCell className="text-muted-foreground font-mono">
            {org.initials}
          </TableCell>
          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
            {org.responsibility.join(", ") || (
              <span className="italic text-xs">–</span>
            )}
          </TableCell>
          <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
            {org.phone ?? org.email ?? (
              <span className="italic text-xs">–</span>
            )}
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-1 justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => onEdit(org)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(org)}
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
