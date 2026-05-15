import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PencilIcon, SaveIcon, UserPlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import {
  BulkAddRunnersForm,
  type QueuedRunner,
} from "@/components/admin/BulkAddRunnersForm.tsx";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  secondsToDuration,
  timeToSeconds,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function PastRaceEditDialog({
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
  const runnerCount = runners.length + pendingRunners.length;

  const refreshRunners = async () => {
    const fresh = await QUERIES.race
      .getAllRunnersInRace(race.uuid ?? "")
      .queryFn();
    setRunners(fresh);
    qc.invalidateQueries({ queryKey: ["race", race.uuid, "runnersInRace"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      await QUERIES.race
        .updateRace(race.uuid!, { ...race, weather: weather || undefined })
        .queryFn();
      if (pendingRunners.length > 0) {
        await QUERIES.race
          .addRunnersToRace(
            race.uuid!,
            pendingRunners.map((q) => ({
              runner: q.runner,
              race,
              resultTime: secondsToDuration(q.resultTime),
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
    setEditTime(
      rr.hideTime
        ? ""
        : formatSecondsToTime(mapResultTimeToNumber(String(rr.resultTime))),
    );
  };

  const handleSaveRunner = (rr: RaceRunnerDTO) => {
    if (!editHideTime && !editTime) return;
    updateRunner.mutate({
      ...rr,
      race,
      resultTime: secondsToDuration(editHideTime ? 0 : timeToSeconds(editTime)),
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
              <span className="text-muted-foreground">({runnerCount})</span>
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

          {runnerCount === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Ingen løpere registrert ennå.
            </p>
          ) : (
            <div className="border rounded-md divide-y max-h-72 overflow-y-auto">
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
                              : formatSecondsToTime(
                                  mapResultTimeToNumber(String(rr.resultTime)),
                                )}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => startEditing(rr)}
                          >
                            <PencilIcon className="size-3.5" />
                          </Button>
                          <DeleteButton
                            size="sm"
                            onClick={() => removeRunner.mutate(rr)}
                          />
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
        </div>{" "}
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
