import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  PencilIcon,
  SaveIcon,
  Trash2Icon,
  UserPlusIcon,
  XIcon,
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
import { Separator } from "@/components/ui/separator.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  formatTimeStamp,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts"; // ─── helpers ──────────────────────────────────────────────────────────────────

// ─── helpers ──────────────────────────────────────────────────────────────────

function isPast(race: RaceDTO): boolean {
  return raceDateToSortKey(race.raceDate) < new Date().toISOString();
}

function timeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
}

// ─── BulkAddRunnersForm ───────────────────────────────────────────────────────

type QueuedRunner = {
  runner: RunnerDTO;
  resultTime: number;
  hideTime: boolean;
};

function BulkAddRunnersForm({
  existing,
  pendingUuids,
  onAdd,
  onDone,
}: {
  existing: RaceRunnerDTO[];
  pendingUuids: Set<string | undefined>;
  onAdd: (runners: QueuedRunner[]) => void;
  onDone: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<RunnerDTO | null>(null);
  const [time, setTime] = useState("");
  const [hideTime, setHideTime] = useState(false);
  const [queue, setQueue] = useState<QueuedRunner[]>([]);

  const existingUuids = new Set(existing.map((r) => r.runner.uuid));
  const queuedUuids = new Set(queue.map((q) => q.runner.uuid));

  const { data: searchResults } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const suggestions = (searchResults ?? []).filter(
    (r) =>
      !existingUuids.has(r.uuid) &&
      !queuedUuids.has(r.uuid) &&
      !pendingUuids.has(r.uuid),
  );

  const handleAddToQueue = () => {
    if (!selected || (!time && !hideTime)) return;
    setQueue((prev) => [
      ...prev,
      {
        runner: selected,
        resultTime: hideTime ? 0 : timeToSeconds(time),
        hideTime,
      },
    ]);
    setSelected(null);
    setQuery("");
    setTime("");
    setHideTime(false);
  };

  const handleConfirm = () => {
    if (queue.length === 0) return;
    onAdd(queue);
    onDone();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Søk løper</Label>
        <Input
          placeholder="Skriv navn..."
          value={selected ? selected.name : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
        />
        {!selected && suggestions.length > 0 && (
          <div className="border rounded-md divide-y max-h-36 overflow-y-auto">
            {suggestions.map((r) => (
              <button
                key={r.uuid}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setSelected(r);
                  setQuery("");
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <Label>Tid (mm:ss eller hh:mm:ss)</Label>
          <Input
            placeholder="23:45"
            value={time}
            disabled={hideTime}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          <input
            id="hideTimeBulk"
            type="checkbox"
            checked={hideTime}
            onChange={(e) => setHideTime(e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="hideTimeBulk" className="whitespace-nowrap">
            Kun deltatt
          </Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-1.5"
        disabled={!selected || (!time && !hideTime)}
        onClick={handleAddToQueue}
      >
        <UserPlusIcon className="size-4" />
        Legg til i listen
      </Button>

      {queue.length > 0 && (
        <>
          <Separator />
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Klar til lagring ({queue.length})
            </p>
            <div className="border rounded-md divide-y max-h-44 overflow-y-auto">
              {queue.map((q, i) => (
                <div
                  key={q.runner.uuid}
                  className="flex items-center justify-between px-3 py-1.5 text-sm"
                >
                  <span className="font-medium">{q.runner.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="tabular-nums font-mono text-muted-foreground">
                      {q.hideTime
                        ? "Deltatt"
                        : formatSecondsToTime(q.resultTime)}
                    </span>
                    <button
                      type="button"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() =>
                        setQueue((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Avbryt
        </Button>
        <Button disabled={queue.length === 0} onClick={handleConfirm}>
          Legg til{" "}
          {queue.length > 0
            ? `${queue.length} løper${queue.length > 1 ? "e" : ""}`
            : ""}
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── PastRaceEditDialog ───────────────────────────────────────────────────────

function PastRaceEditDialog({
  race,
  initialRunners,
  onClose,
  onSaved,
}: {
  race: RaceDTO;
  initialRunners: RaceRunnerDTO[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const qc = useQueryClient();
  const [weather, setWeather] = useState(race.weather ?? "");
  const [showAddRunners, setShowAddRunners] = useState(false);
  const [pendingRunners, setPendingRunners] = useState<QueuedRunner[]>([]);
  const [runners, setRunners] = useState<RaceRunnerDTO[]>(initialRunners);
  const [editingRunnerUuid, setEditingRunnerUuid] = useState<string | null>(
    null,
  );
  const [editTime, setEditTime] = useState("");
  const [editHideTime, setEditHideTime] = useState(false);

  const pendingUuids = new Set(pendingRunners.map((r) => r.runner.uuid));

  const refreshRunners = async () => {
    const fresh = await QUERIES.race
      .getAllRunnersInRace(race.uuid ?? "")
      .queryFn();
    setRunners(fresh);
    qc.invalidateQueries({ queryKey: ["race", race.uuid, "runnersInRace"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await kyClient
        .patch(`/api/races/${race.uuid}`, {
          json: { ...race, weather: weather || undefined },
        })
        .json<RaceDTO>();
      if (pendingRunners.length > 0) {
        await QUERIES.race
          .addRunnersToRace(
            race.uuid!,
            pendingRunners.map((q) => ({
              runner: q.runner,
              race,
              resultTime: q.resultTime,
              hideTime: q.hideTime,
            })),
          )
          .queryFn();
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", race.uuid, "runnersInRace"] });
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      onSaved();
      onClose();
    },
  });

  const removeRunner = useMutation({
    mutationFn: (rr: RaceRunnerDTO) =>
      QUERIES.race.removeRunnersFromRace(race.uuid!, [rr]).queryFn(),
    onSuccess: refreshRunners,
  });

  const updateRunner = useMutation({
    mutationFn: (rr: RaceRunnerDTO) =>
      QUERIES.race
        .updateRunnerInRace(race.uuid!, rr.runner.uuid!, rr)
        .queryFn(),
    onSuccess: () => {
      setEditingRunnerUuid(null);
      refreshRunners();
    },
  });

  const startEditing = (rr: RaceRunnerDTO) => {
    setEditingRunnerUuid(rr.runner.uuid ?? null);
    setEditHideTime(rr.hideTime);
    setEditTime(rr.hideTime ? "" : formatSecondsToTime(rr.resultTime));
  };

  const handleSaveRunner = (rr: RaceRunnerDTO) => {
    if (!editHideTime && !editTime) return;
    updateRunner.mutate({
      ...rr,
      race,
      resultTime: editHideTime ? 0 : timeToSeconds(editTime),
      hideTime: editHideTime,
    });
  };

  if (showAddRunners) {
    return (
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Legg til løpere – {formatDDMonth(race.raceDate)}
          </DialogTitle>
        </DialogHeader>
        <BulkAddRunnersForm
          existing={runners}
          pendingUuids={pendingUuids}
          onAdd={(newRunners) =>
            setPendingRunners((prev) => [...prev, ...newRunners])
          }
          onDone={() => setShowAddRunners(false)}
        />
      </DialogContent>
    );
  }

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Rediger løp – {formatDDMonth(race.raceDate)}</DialogTitle>
      </DialogHeader>

      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label>Vær</Label>
          <Input
            placeholder="f.eks. Sol og 15°C"
            value={weather}
            onChange={(e) => setWeather(e.target.value)}
          />
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              Løpere{" "}
              <span className="text-muted-foreground">
                ({runners.length + pendingRunners.length})
              </span>
            </p>
            <Button
              size="sm"
              variant="outline"
              className="h-7 gap-1.5 text-xs"
              onClick={() => setShowAddRunners(true)}
            >
              <UserPlusIcon className="size-3.5" />
              Legg til løpere
            </Button>
          </div>

          {runners.length === 0 && pendingRunners.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Ingen løpere registrert ennå.
            </p>
          )}

          {(runners.length > 0 || pendingRunners.length > 0) && (
            <div className="border rounded-md divide-y max-h-72 overflow-y-auto">
              {/* Saved runners */}
              {runners.map((rr) => {
                const isEditing = editingRunnerUuid === rr.runner.uuid;
                return (
                  <div key={rr.runner.uuid} className="px-3 py-1.5 text-sm">
                    {!isEditing ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium">{rr.runner.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums font-mono text-muted-foreground text-xs">
                            {rr.hideTime
                              ? "Kun deltatt"
                              : formatSecondsToTime(rr.resultTime)}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(rr)}
                          >
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => removeRunner.mutate(rr)}
                          >
                            <Trash2Icon className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="font-medium shrink-0">
                          {rr.runner.name}
                        </span>
                        <Input
                          placeholder="mm:ss"
                          value={editTime}
                          disabled={editHideTime}
                          onChange={(e) => setEditTime(e.target.value)}
                          className="h-6 text-xs w-24 px-2"
                        />
                        <div className="flex items-center gap-1">
                          <input
                            id={`hideTime-${rr.runner.uuid}`}
                            type="checkbox"
                            checked={editHideTime}
                            onChange={(e) => setEditHideTime(e.target.checked)}
                            className="rounded"
                          />
                          <label
                            htmlFor={`hideTime-${rr.runner.uuid}`}
                            className="text-xs whitespace-nowrap"
                          >
                            Deltatt
                          </label>
                        </div>
                        <Button
                          size="sm"
                          className="h-6 gap-1 text-xs px-2"
                          disabled={
                            (!editTime && !editHideTime) ||
                            updateRunner.isPending
                          }
                          onClick={() => handleSaveRunner(rr)}
                        >
                          <SaveIcon className="size-3" />
                          Lagre
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingRunnerUuid(null)}
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
              {/* Pending (not yet saved) runners */}
              {pendingRunners.map((q) => (
                <div
                  key={q.runner.uuid}
                  className="px-3 py-1.5 text-sm flex items-center justify-between gap-2 bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{q.runner.name}</span>
                    <Badge variant="outline" className="text-xs py-0">
                      Ikke lagret
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular-nums font-mono text-muted-foreground text-xs">
                      {q.hideTime
                        ? "Kun deltatt"
                        : formatSecondsToTime(q.resultTime)}
                    </span>
                    <button
                      type="button"
                      className="text-destructive hover:text-destructive/80"
                      onClick={() =>
                        setPendingRunners((prev) =>
                          prev.filter((r) => r.runner.uuid !== q.runner.uuid),
                        )
                      }
                    >
                      <XIcon className="size-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          Lagre
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function RegisterResults() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidateRaces = () =>
    qc.invalidateQueries({ queryKey: ["race", "getAll"] });

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const past = [...(races ?? [])]
    .filter((r) => isPast(r))
    .sort((a, b) =>
      raceDateToSortKey(b.raceDate).localeCompare(
        raceDateToSortKey(a.raceDate),
      ),
    );

  // Fan out one runners query per past race
  const runnerResults = useQueries({
    queries: past.map((r) => ({
      ...QUERIES.race.getAllRunnersInRace(r.uuid ?? ""),
      enabled: !!r.uuid,
    })),
  });

  // Map raceUuid -> runner count (undefined = still loading)
  const runnerCountByRace = new Map<string, number>(
    past.map((r, i) => [r.uuid ?? "", runnerResults[i].data?.length ?? 0]),
  );

  const withoutRunners = past.filter(
    (r) => runnerCountByRace.get(r.uuid ?? "") === 0,
  );
  const withRunners = past.filter(
    (r) => (runnerCountByRace.get(r.uuid ?? "") ?? 0) > 0,
  );

  const openEditing = async (race: RaceDTO) => {
    const idx = past.findIndex((r) => r.uuid === race.uuid);
    const cached = runnerResults[idx]?.data;
    if (!cached) {
      await qc.fetchQuery(QUERIES.race.getAllRunnersInRace(race.uuid ?? ""));
    }
    setEditing(race);
  };

  const [editing, setEditing] = useState<RaceDTO | null>(null);
  const [deleting, setDeleting] = useState<RaceDTO | null>(null);

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      kyClient.delete(`/api/races/${uuid}`).json<void>(),
    onSuccess: () => {
      invalidateRaces();
      setDeleting(null);
    },
  });

  const raceTable = (rows: RaceDTO[], showRunnerCount: boolean) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dato</TableHead>
          <TableHead>Tid</TableHead>
          <TableHead>Vær</TableHead>
          {showRunnerCount && (
            <TableHead className="text-right">Løpere</TableHead>
          )}
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((race) => (
          <TableRow key={race.uuid}>
            <TableCell>
              <div className="flex items-center gap-2">
                <CheckCircle2Icon className="size-3.5 text-green-600 shrink-0" />
                <span className="font-medium">
                  {formatDDMonth(race.raceDate)}
                </span>
              </div>
            </TableCell>
            <TableCell className="tabular-nums text-muted-foreground">
              {formatTimeStamp(race.raceDate)}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {race.weather ?? (
                <span className="italic text-xs">Ikke registrert</span>
              )}
            </TableCell>
            {showRunnerCount && (
              <TableCell className="text-right tabular-nums text-muted-foreground">
                {runnerCountByRace.get(race.uuid ?? "") ?? "–"}
              </TableCell>
            )}
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0"
                  onClick={() => openEditing(race)}
                >
                  <PencilIcon className="size-3.5" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                  onClick={() => setDeleting(race)}
                >
                  <Trash2Icon className="size-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

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

      <h1 className="text-2xl font-bold tracking-tight">
        Registrer resultater
      </h1>

      {/* Races without runners — shown first */}
      {withoutRunners.length > 0 && (
        <Card className="border-orange-200 dark:border-orange-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <UserPlusIcon className="size-4 text-orange-500" />
              Mangler løpere
              <Badge variant="secondary">{withoutRunners.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {raceTable(withoutRunners, false)}
          </CardContent>
        </Card>
      )}

      {/* Races with runners */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle2Icon className="size-4 text-green-600" />
            Gjennomførte løp
            <Badge variant="secondary">{withRunners.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {withRunners.length === 0 ? (
            <p className="text-center text-muted-foreground py-6 text-sm italic">
              Ingen gjennomførte løp med registrerte løpere ennå.
            </p>
          ) : (
            raceTable(withRunners, true)
          )}
        </CardContent>
      </Card>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        {editing && (
          <PastRaceEditDialog
            race={editing}
            initialRunners={
              runnerResults[past.findIndex((r) => r.uuid === editing.uuid)]
                ?.data ?? []
            }
            onClose={() => setEditing(null)}
            onSaved={invalidateRaces}
          />
        )}
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
            <DialogTitle>Slett løp</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Er du sikker på at du vil slette løpet{" "}
            <span className="font-semibold text-foreground">
              {deleting && formatDDMonth(deleting.raceDate)}
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
