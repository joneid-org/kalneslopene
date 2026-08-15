import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BanIcon, ChevronLeftIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { InviteUserDialog } from "@/components/admin/InviteUserDialog.tsx";
import { UsersCard } from "@/components/admin/UsersCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Dialog } from "@/components/ui/dialog.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import type { InviteDTO, UserDTO, UserRole } from "@/model/DTO.ts";

export function CRUDUsers() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: users } = useQuery(QUERIES.user.getUsers);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["user", "getAll"] });

  const [showInvite, setShowInvite] = useState(false);
  const [invite, setInvite] = useState<InviteDTO | null>(null);
  // No invalidation: an invite creates no user until someone redeems the link
  const inviteMutation = useMutation({
    mutationFn: (roles: UserRole[]) => MUTATIONS.user.createInvite(roles),
    onSuccess: setInvite,
  });

  const rolesMutation = useMutation({
    mutationFn: ({ uuid, roles }: { uuid: string; roles: UserRole[] }) =>
      MUTATIONS.user.setRoles(uuid, roles),
    onSuccess: invalidate,
  });

  const [banning, setBanning] = useState<UserDTO | null>(null);
  const banMutation = useMutation({
    mutationFn: ({ uuid, banned }: { uuid: string; banned: boolean }) =>
      MUTATIONS.user.setBanned(uuid, banned),
    onSuccess: () => {
      invalidate();
      setBanning(null);
    },
  });

  function closeInvite() {
    setShowInvite(false);
    setInvite(null);
  }

  return (
    <div className="page-content max-w-3xl mx-auto space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">
          Brukeradministrasjon
        </h1>
        <Button className="gap-1.5" onClick={() => setShowInvite(true)}>
          <UserPlusIcon className="size-4" />
          Inviter bruker
        </Button>
      </div>

      <UsersCard
        users={users ?? []}
        currentUsername={currentUser?.username}
        onToggleRole={(user, role) =>
          rolesMutation.mutate({
            uuid: user.uuid,
            roles: user.roles.includes(role)
              ? user.roles.filter((r) => r !== role)
              : [...user.roles, role],
          })
        }
        onBan={setBanning}
        onUnban={(user) =>
          banMutation.mutate({ uuid: user.uuid, banned: false })
        }
      />

      <Dialog
        open={showInvite}
        onOpenChange={(open) => {
          if (!open) closeInvite();
        }}
      >
        <InviteUserDialog
          invite={invite}
          isPending={inviteMutation.isPending}
          onCreate={(roles) => inviteMutation.mutate(roles)}
          onClose={closeInvite}
        />
      </Dialog>

      <Dialog
        open={!!banning}
        onOpenChange={(open) => {
          if (!open) setBanning(null);
        }}
      >
        {banning && (
          <ConfirmDeleteDialog
            title="Utesteng bruker"
            description={
              <>
                Er du sikker på at du vil utestenge{" "}
                <span className="font-semibold text-foreground">
                  {banning.username}
                </span>
                ? Brukeren blir ikke slettet, og utestengelsen kan oppheves
                senere.
              </>
            }
            isPending={banMutation.isPending}
            confirmLabel="Utesteng"
            confirmIcon={<BanIcon className="size-4" />}
            onConfirm={() =>
              banMutation.mutate({ uuid: banning.uuid, banned: true })
            }
            onClose={() => setBanning(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
