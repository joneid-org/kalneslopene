import { CheckIcon, CopyIcon, LinkIcon } from "lucide-react";
import { useState } from "react";
import { LoadingButton } from "@/components/LoadingButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { InviteDTO, UserRole } from "@/model/DTO.ts";

const ROLES: UserRole[] = ["ADMIN", "EDITOR"];

export function InviteUserDialog({
  invite,
  isPending,
  onCreate,
  onClose,
}: {
  invite: InviteDTO | null;
  isPending: boolean;
  onCreate: (roles: UserRole[]) => void;
  onClose: () => void;
}) {
  const [roles, setRoles] = useState<UserRole[]>(["EDITOR"]);
  const [copied, setCopied] = useState(false);

  function toggleRole(role: UserRole) {
    setRoles((current) =>
      current.includes(role)
        ? current.filter((r) => r !== role)
        : [...current, role],
    );
  }

  // The backend serves this SPA from the same origin, so the link needs no configured base URL
  const inviteLink = invite
    ? `${window.location.origin}/invitasjon/${invite.token}`
    : "";

  async function copyLink() {
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
  }

  if (invite) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitasjonslenke</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Send denne lenken til den nye brukeren. Den kan bare brukes én gang,
          og utløper{" "}
          <span className="font-medium text-foreground">
            {new Date(invite.expiresAt).toLocaleString("nb-NO", {
              dateStyle: "long",
              timeStyle: "short",
            })}
          </span>
          .
        </p>
        <div className="flex gap-2">
          <Input readOnly value={inviteLink} className="font-mono text-xs" />
          <Button
            variant="outline"
            size="icon"
            aria-label="Kopier lenke"
            onClick={copyLink}
          >
            {copied ? (
              <CheckIcon className="size-4" />
            ) : (
              <CopyIcon className="size-4" />
            )}
          </Button>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Lukk</Button>
        </DialogFooter>
      </DialogContent>
    );
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Inviter bruker</DialogTitle>
      </DialogHeader>
      <div className="space-y-1.5">
        <Label>Roller</Label>
        <div className="flex gap-3">
          {ROLES.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => toggleRole(role)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                roles.includes(role)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Lenken er gyldig i 24 timer og kan bare brukes én gang.
        </p>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <LoadingButton
          loading={isPending}
          disabled={roles.length === 0}
          icon={<LinkIcon className="size-4" />}
          onClick={() => onCreate(roles)}
        >
          Lag lenke
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  );
}
