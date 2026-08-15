import { BanIcon, ShieldUserIcon, UndoIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { RoleCombobox } from "@/components/admin/RoleCombobox.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import type { UserDTO, UserRole } from "@/model/DTO.ts";

export function UsersCard({
  users,
  currentUsername,
  onRolesChange,
  onBan,
  onUnban,
}: {
  users: UserDTO[];
  currentUsername?: string;
  onRolesChange: (user: UserDTO, roles: UserRole[]) => void;
  onBan: (user: UserDTO) => void;
  onUnban: (user: UserDTO) => void;
}) {
  return (
    <AdminCard
      icon={<ShieldUserIcon className="size-4 text-primary" />}
      title="Alle brukere"
      items={users}
      columns={[
        { label: "Brukernavn" },
        { label: "Roller" },
        { label: "Status" },
        { label: "", className: "w-14" },
      ]}
      emptyText="Ingen brukere funnet."
      renderRow={(user) => {
        const isSelf = user.username === currentUsername;
        return (
          <>
            <TableCell className="font-medium">
              {user.username}
              {isSelf && (
                <span className="ml-1.5 text-xs text-muted-foreground">
                  (deg)
                </span>
              )}
            </TableCell>
            <TableCell>
              <RoleCombobox
                roles={user.roles}
                onRolesChange={(roles) => onRolesChange(user, roles)}
                // Removing your own ADMIN role would lock you out — the backend rejects it too
                lockedRole={isSelf ? "ADMIN" : undefined}
                className="min-w-48"
              />
            </TableCell>
            <TableCell>
              {user.banned ? (
                <Badge variant="destructive">Utestengt</Badge>
              ) : (
                <span className="text-sm text-muted-foreground">Aktiv</span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                variant="ghost"
                size="icon"
                disabled={isSelf}
                aria-label={
                  user.banned ? "Opphev utestengelse" : "Utesteng bruker"
                }
                className={user.banned ? undefined : "text-destructive"}
                onClick={() => (user.banned ? onUnban(user) : onBan(user))}
              >
                {user.banned ? (
                  <UndoIcon className="size-4" />
                ) : (
                  <BanIcon className="size-4" />
                )}
              </Button>
            </TableCell>
          </>
        );
      }}
    />
  );
}
