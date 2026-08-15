import { BanIcon, ShieldUserIcon, UndoIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import type { UserDTO, UserRole } from "@/model/DTO.ts";

const ROLES: UserRole[] = ["ADMIN", "EDITOR"];

export function UsersCard({
  users,
  currentUsername,
  onToggleRole,
  onBan,
  onUnban,
}: {
  users: UserDTO[];
  currentUsername?: string;
  onToggleRole: (user: UserDTO, role: UserRole) => void;
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
              <div className="flex flex-wrap gap-1.5">
                {ROLES.map((role) => {
                  const active = user.roles.includes(role);
                  // Removing your own ADMIN role would lock you out — the backend rejects it too
                  const locked = isSelf && role === "ADMIN";
                  return (
                    <button
                      key={role}
                      type="button"
                      disabled={locked}
                      onClick={() => onToggleRole(user, role)}
                      className={`rounded-md border px-2 py-1 text-xs transition-colors disabled:opacity-50 ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background hover:bg-muted"
                      }`}
                    >
                      {role}
                    </button>
                  );
                })}
              </div>
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
