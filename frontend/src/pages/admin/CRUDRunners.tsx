import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  UserIcon,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

// ─── RunnerForm ────────────────────────────────────────────────────────────────

function RunnerForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<RunnerDTO>;
  onSubmit: (runner: Omit<RunnerDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [gender, setGender] = useState(initial.gender ?? "");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Navn</Label>
        <Input
          placeholder="Fornavn Etternavn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Kjønn</Label>
        <div className="flex gap-3">
          {["Mann", "Kvinne"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                gender === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onCancel}>
          Avbryt
        </Button>
        <Button
          disabled={!name.trim() || !gender}
          onClick={() => onSubmit({ name: name.trim(), gender })}
        >
          {submitLabel}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function CRUDRunners() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["runner", "getAll"] });

  const [search, setSearch] = useState("");
  const { data: runners } = useQuery(
    QUERIES.runner.getAllRunners(search || undefined),
  );

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (runner: Omit<RunnerDTO, "uuid">) =>
      kyClient.post("/api/runners", { json: [runner] }).json<RunnerDTO[]>(),
    onSuccess: () => {
      invalidate();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<RunnerDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: (runner: RunnerDTO) =>
      kyClient
        .patch(`/api/runners/${runner.uuid}`, { json: runner })
        .json<RunnerDTO>(),
    onSuccess: () => {
      invalidate();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<RunnerDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      kyClient.delete(`/api/runners/${uuid}`).json<void>(),
    onSuccess: () => {
      invalidate();
      setDeleting(null);
    },
  });

  const displayed = runners ?? [];

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
        <h1 className="text-2xl font-bold tracking-tight">Løpere</h1>
        <Button className="gap-1.5" onClick={() => setShowAdd(true)}>
          <PlusIcon className="size-4" />
          Legg til løper
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2 space-y-2">
          <CardTitle className="text-base flex items-center gap-2">
            <UserIcon className="size-4 text-primary" />
            Alle løpere
            <Badge variant="secondary">{displayed.length}</Badge>
          </CardTitle>
          <Input
            placeholder="Søk etter navn..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Navn</TableHead>
                <TableHead>Kjønn</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-6 text-sm italic"
                  >
                    Ingen løpere funnet.
                  </TableCell>
                </TableRow>
              )}
              {displayed.map((runner) => (
                <TableRow key={runner.uuid}>
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
                        onClick={() => setEditing(runner)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(runner)}
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
            <DialogTitle>Legg til løper</DialogTitle>
          </DialogHeader>
          <RunnerForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(r) => addMutation.mutate(r)}
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
            <DialogTitle>Rediger løper</DialogTitle>
          </DialogHeader>
          {editing && (
            <RunnerForm
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onSubmit={(r) => editMutation.mutate({ ...editing, ...r })}
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
            <DialogTitle>Slett løper</DialogTitle>
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
