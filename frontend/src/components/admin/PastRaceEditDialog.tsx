import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  secondsToDuration,
  timeToSeconds,
} from "@/lib/timeUtils.ts";
import { WEATHER_SYMBOL_OPTIONS } from "@/lib/weatherDisplay.ts";
import type { RaceDTO, RaceRunnerDTO, WeatherDto } from "@/model/DTO.ts";

export function PastRaceEditDialog({
  race,
  onClose,
}: {
  race: RaceDTO;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [symbol, setSymbol] = useState(race.weather?.symbol ?? "");
  const [temperature, setTemperature] = useState(
    () => race.weather?.temperature?.toString() ?? "",
  );
  const [windSpeed, setWindSpeed] = useState(
    () => race.weather?.windSpeed?.toString() ?? "",
  );
  const [precipitation, setPrecipitation] = useState(
    () => race.weather?.precipitation?.toString() ?? "",
  );
  const [courseCondition, setCourseCondition] = useState(
    race.courseCondition ?? "",
  );
  const [showAddRunners, setShowAddRunners] = useState(false);
  const [pendingRunners, setPendingRunners] = useState<QueuedRunner[]>([]);
  const { data: initialRunners } = useQuery(
    QUERIES.race.getAllRunnersInRace(race.uuid),
  );
  const runners = initialRunners ?? [];
  const [editingRunnerUuid, setEditingRunnerUuid] = useState<string | null>(
    null,
  );
  const [editTime, setEditTime] = useState("");
  const [editHideTime, setEditHideTime] = useState(false);

  const pendingUuids = new Set(pendingRunners.map((r) => r.runner.uuid));
  const runnerCount = runners.length + pendingRunners.length;

  const saveMutation = useMutation({
    mutationFn: async () => {
      const weather: WeatherDto | undefined = symbol
        ? {
            symbol,
            temperature: Number(temperature) || 0,
            windSpeed: Number(windSpeed) || 0,
            precipitation: Number(precipitation) || 0,
          }
        : undefined;
      await QUERIES.race
        .updateRace(race.uuid, {
          raceDate: race.raceDate,
          weather,
          courseCondition: courseCondition || undefined,
        })
        .queryFn();
      if (pendingRunners.length > 0) {
        await QUERIES.race
          .addRunnersToRace(
            race.uuid,
            pendingRunners.map((q) => ({
              runner: q.runner,
              raceUuid: race.uuid,
              resultTime: secondsToDuration(q.resultTime),
              hideTime: q.hideTime,
              totalRaces: 0,
            })),
          )
          .queryFn();
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["race", race.uuid, "runnersInRace"],
      });
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      onClose();
    },
  });

  const resetToAutoMutation = useMutation({
    mutationFn: () =>
      QUERIES.race
        .updateRace(race.uuid, {
          raceDate: race.raceDate,
          weatherManuallyEdited: false,
        })
        .queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      onClose();
    },
  });

  const removeRunner = useMutation({
    mutationFn: (rr: RaceRunnerDTO) =>
      QUERIES.race.removeRunnersFromRace(race.uuid, [rr]).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["race", race.uuid, "runnersInRace"],
      });
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
    },
  });

  const updateRunner = useMutation({
    mutationFn: (rr: RaceRunnerDTO) =>
      QUERIES.race.updateRunnerInRace(race.uuid, rr.runner.uuid, rr).queryFn(),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["race", race.uuid, "runnersInRace"],
      });
      setEditingRunnerUuid(null);
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
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Vær</Label>
            {race.weatherManuallyEdited && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                disabled={resetToAutoMutation.isPending}
                onClick={() => resetToAutoMutation.mutate()}
              >
                Tilbakestill til automatisk
              </Button>
            )}
          </div>
          {race.weatherManuallyEdited && (
            <p className="text-xs text-muted-foreground">
              Værdata er manuelt overstyrt og oppdateres ikke automatisk fra yr.
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Forhold</Label>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Velg vær" />
                </SelectTrigger>
                <SelectContent>
                  {WEATHER_SYMBOL_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Temperatur (°C)
              </Label>
              <Input
                type="number"
                placeholder="f.eks. 15"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Vind (m/s)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="f.eks. 3.5"
                value={windSpeed}
                onChange={(e) => setWindSpeed(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">
                Nedbør (mm)
              </Label>
              <Input
                type="number"
                step="0.1"
                placeholder="f.eks. 0"
                value={precipitation}
                onChange={(e) => setPrecipitation(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              Løypeforhold
            </Label>
            <Input
              placeholder="f.eks. Tørt og fint"
              value={courseCondition}
              onChange={(e) => setCourseCondition(e.target.value)}
            />
          </div>
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
                            className="size-6 p-0 text-muted-foreground hover:text-foreground"
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
                            aria-label="Skjul tid (kun deltatt)"
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
                          className="size-6 p-0 text-muted-foreground hover:text-foreground"
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
                      aria-label={`Fjern ${q.runner.name} fra listen`}
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
