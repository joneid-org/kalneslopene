import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { kyClient } from "@/api/queryClient.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { OrganizerDTO } from "@/model/DTO.ts";

// ─── OrganizerForm ─────────────────────────────────────────────────────────────

function OrganizerForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<OrganizerDTO>;
  onSubmit: (organizer: Omit<OrganizerDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [initials, setInitials] = useState(initial.initials ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [responsibilityInput, setResponsibilityInput] = useState(
    (initial.responsibility ?? []).join(", "),
  );
  const [contactPerson, setContactPerson] = useState(
    initial.contactPerson ?? false,
  );

  const handleSubmit = () => {
    const responsibility = responsibilityInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({
      name: name.trim(),
      initials: initials.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      responsibility,
      contactPerson,
    });
  };

  const isValid = name.trim() && initials.trim();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Navn</Label>
          <Input
            placeholder="Fornavn Etternavn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Initialer</Label>
          <Input
            placeholder="FE"
            maxLength={4}
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Ansvarsområder</Label>
        <Input
          placeholder="Start, Målgang, Tidtaking"
          value={responsibilityInput}
          onChange={(e) => setResponsibilityInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Kommaseparert liste</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Telefon</Label>
          <Input
            placeholder="+47 000 00 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>E-post</Label>
          <Input
            type="email"
            placeholder="navn@eksempel.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="contactPerson"
          checked={contactPerson}
          onCheckedChange={setContactPerson}
        />
        <Label htmlFor="contactPerson">Kontaktperson</Label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button disabled={!isValid} onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CRUDOrganizers() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["organizer", "getAll"] });

  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (organizer: Omit<OrganizerDTO, "uuid">) =>
      kyClient
        .post("/api/organizers/createOrganizer", { json: organizer })
        .json<OrganizerDTO>(),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<OrganizerDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (organizer: OrganizerDTO) =>
      kyClient
        .patch(`/api/organizers/${organizer.uuid}`, { json: organizer })
        .json<OrganizerDTO>(),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<OrganizerDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      kyClient.delete(`/api/organizers/${uuid}`).json<void>(),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
    },
  });

  const displayed = organizers ?? [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Organisatorer</h1>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til organisator
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UsersIcon className="size-4 text-primary" />
            Alle organisatorer
            <Badge variant="secondary">{displayed.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Initialer</TableHead>
                <TableHead className="hidden sm:table-cell">
                  Ansvarsområder
                </TableHead>
                <TableHead className="hidden sm:table-cell">Kontakt</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-muted-foreground py-6 text-sm italic"
                  >
                    Ingen organisatorer registrert.
                  </TableCell>
                </TableRow>
              )}
              {displayed.map((org) => (
                <TableRow key={org.uuid}>
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
                        onClick={() => setEditing(org)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(org)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til organisator</DialogTitle>
          </DialogHeader>
          <OrganizerForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(o) => addMutation.mutate(o)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger organisator</DialogTitle>
          </DialogHeader>
          {editing && (
            <OrganizerForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(o) => editMutation.mutate({ ...editing, ...o })}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett organisator</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Er du sikker på at du vil slette{" "}
            <span className="font-semibold text-foreground">
              {deleting?.name}
            </span>
            ? Dette kan ikke angres.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleting?.uuid && deleteMutation.mutate(deleting.uuid)
              }
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
