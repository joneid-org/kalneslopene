import { DatabaseIcon, Loader2Icon, ReplaceIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { DraftEntry } from "@/model/DTO.ts";
import { ChangeRunnerField } from "./ChangeRunnerField.tsx";
import { genderLabel } from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

export function ReviewStep({
  entries,
  weather,
  onWeatherChange,
  onUpdate,
  onRemove,
  onSaveRunnerToDb,
  savingClientId,
}: {
  entries: DraftEntry[];
  weather: string;
  onWeatherChange: (weather: string) => void;
  onUpdate: (clientId: string, patch: Partial<DraftEntry>) => void;
  onRemove: (clientId: string) => void;
  onSaveRunnerToDb: (entry: DraftEntry) => void;
  savingClientId: string | null;
}) {
  const [changingClientId, setChangingClientId] = useState<string | null>(null);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Se over</h2>
        <p className="text-sm text-muted-foreground">
          Rett opp tider. Nye løpere kan endres og lagres i databasen. For
          løpere som allerede finnes i databasen kan du bytte til en annen løper
          hvis feil person ble valgt.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Vær</Label>
        <Input
          placeholder="f.eks. Sol og 15°C"
          value={weather}
          onChange={(e) => onWeatherChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Løpere{" "}
          <span className="text-muted-foreground">({entries.length})</span>
        </p>
        {entries.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            Ingen løpere registrert.
          </p>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => {
              const isNew = entry.runnerUuid == null;
              const isChanging = changingClientId === entry.clientId;
              const excludeUuids = new Set(
                entries
                  .map((e) => e.runnerUuid)
                  .filter((u): u is string => u != null),
              );

              return (
                <div
                  key={entry.clientId}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="flex items-center gap-2">
                    {isNew ? (
                      <Input
                        value={entry.name}
                        onChange={(e) =>
                          onUpdate(entry.clientId, { name: e.target.value })
                        }
                        className="h-8 flex-1 text-sm"
                      />
                    ) : (
                      <span className="flex-1 truncate text-sm font-medium">
                        {entry.name}
                      </span>
                    )}
                    <Badge
                      variant={isNew ? "outline" : "secondary"}
                      className="shrink-0 py-0 text-xs"
                    >
                      {isNew ? "Ny" : "Lagret"}
                    </Badge>
                    <button
                      type="button"
                      className="shrink-0 text-destructive hover:text-destructive/80"
                      onClick={() => onRemove(entry.clientId)}
                      aria-label={`Fjern ${entry.name}`}
                    >
                      <XIcon className="size-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {isNew ? (
                      <div className="flex gap-1">
                        {(["MALE", "FEMALE"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() =>
                              onUpdate(entry.clientId, { gender: g })
                            }
                            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                              entry.gender.toUpperCase() === g
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-background hover:bg-muted"
                            }`}
                          >
                            {genderLabel(g)}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        {genderLabel(entry.gender)}
                      </span>
                    )}
                    <TimeField
                      seconds={entry.resultTimeSeconds}
                      disabled={entry.hideTime}
                      onChange={(seconds) =>
                        onUpdate(entry.clientId, { resultTimeSeconds: seconds })
                      }
                      className="h-8 w-24 px-2 text-sm"
                    />
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={entry.hideTime}
                        onChange={(e) =>
                          onUpdate(entry.clientId, {
                            hideTime: e.target.checked,
                            resultTimeSeconds: e.target.checked
                              ? null
                              : entry.resultTimeSeconds,
                          })
                        }
                        className="rounded"
                      />
                      Kun deltatt
                    </label>
                    {isNew ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto h-8 gap-1.5 text-xs"
                        disabled={savingClientId === entry.clientId}
                        onClick={() => onSaveRunnerToDb(entry)}
                      >
                        {savingClientId === entry.clientId ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <DatabaseIcon className="size-3.5" />
                        )}
                        Lagre løper
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto h-8 gap-1.5 text-xs"
                        onClick={() =>
                          setChangingClientId(
                            isChanging ? null : entry.clientId,
                          )
                        }
                      >
                        <ReplaceIcon className="size-3.5" />
                        Bytt løper
                      </Button>
                    )}
                  </div>

                  {isChanging && !isNew && (
                    <ChangeRunnerField
                      excludeRunnerUuids={excludeUuids}
                      onPick={(runner) => {
                        onUpdate(entry.clientId, {
                          runnerUuid: runner.uuid,
                          name: runner.name,
                          gender: runner.gender,
                          createdThisSession: false,
                        });
                        setChangingClientId(null);
                      }}
                      onCancel={() => setChangingClientId(null)}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
