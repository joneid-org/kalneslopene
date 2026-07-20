import { CheckIcon, Loader2Icon, ReplaceIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";
import { ChangeRunnerField } from "./ChangeRunnerField.tsx";
import { entrySeconds, genderLabel } from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

export function ReviewStep({
  entries,
  weather,
  onWeatherChange,
  onWeatherBlur,
  onUpdateResult,
  onUpdateRunner,
  onRemove,
  onVerifyRunner,
  onChangeRunner,
  busyRunnerUuid,
}: {
  entries: RaceRunnerDTO[];
  weather: string;
  onWeatherChange: (weather: string) => void;
  onWeatherBlur: () => void;
  onUpdateResult: (
    runnerUuid: string,
    patch: { resultTime?: string; hideTime?: boolean },
  ) => void;
  onUpdateRunner: (
    runnerUuid: string,
    patch: { name?: string; gender?: string },
  ) => void;
  onRemove: (runnerUuid: string) => void;
  onVerifyRunner: (runnerUuid: string) => void;
  onChangeRunner: (runnerUuid: string, newRunner: RunnerDTO) => void;
  busyRunnerUuid: string | null;
}) {
  const [changingRunnerUuid, setChangingRunnerUuid] = useState<string | null>(
    null,
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Se over</h2>
        <p className="text-sm text-muted-foreground">
          Rett opp tider. Nye løpere kan endres og bekreftes. For løpere som
          allerede finnes i databasen kan du bytte til en annen løper hvis feil
          person ble valgt.
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>Vær</Label>
        <Input
          placeholder="f.eks. Sol og 15°C"
          value={weather}
          onChange={(e) => onWeatherChange(e.target.value)}
          onBlur={onWeatherBlur}
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
              const runnerUuid = entry.runner.uuid;
              const isNew = !entry.runner.isVerified;
              const isChanging = changingRunnerUuid === runnerUuid;
              const isBusy = busyRunnerUuid === runnerUuid;
              const excludeUuids = new Set(entries.map((e) => e.runner.uuid));

              return (
                <div
                  key={runnerUuid}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="flex items-center gap-2">
                    {isNew ? (
                      <Input
                        value={entry.runner.name}
                        onChange={(e) =>
                          onUpdateRunner(runnerUuid, { name: e.target.value })
                        }
                        className="h-8 flex-1 text-sm"
                      />
                    ) : (
                      <span className="flex-1 truncate text-sm font-medium">
                        {entry.runner.name}
                      </span>
                    )}
                    <Badge
                      variant={isNew ? "outline" : "secondary"}
                      className="shrink-0 py-0 text-xs"
                    >
                      {isNew ? "Ny" : "Bekreftet"}
                    </Badge>
                    <button
                      type="button"
                      className="shrink-0 text-destructive hover:text-destructive/80"
                      onClick={() => onRemove(runnerUuid)}
                      aria-label={`Fjern ${entry.runner.name}`}
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
                              onUpdateRunner(runnerUuid, { gender: g })
                            }
                            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                              entry.runner.gender.toUpperCase() === g
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
                        {genderLabel(entry.runner.gender)}
                      </span>
                    )}
                    <TimeField
                      seconds={entrySeconds(entry)}
                      disabled={entry.hideTime}
                      onChange={(seconds) =>
                        onUpdateResult(runnerUuid, {
                          resultTime: secondsToDuration(seconds ?? 0),
                        })
                      }
                      className="h-8 w-24 px-2 text-sm"
                    />
                    <label className="flex items-center gap-1.5 text-xs">
                      <input
                        type="checkbox"
                        checked={entry.hideTime}
                        onChange={(e) =>
                          onUpdateResult(runnerUuid, {
                            hideTime: e.target.checked,
                            ...(e.target.checked ? { resultTime: "PT0S" } : {}),
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
                        disabled={isBusy}
                        onClick={() => onVerifyRunner(runnerUuid)}
                      >
                        {isBusy ? (
                          <Loader2Icon className="size-3.5 animate-spin" />
                        ) : (
                          <CheckIcon className="size-3.5" />
                        )}
                        Lagre løper
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="ml-auto h-8 gap-1.5 text-xs"
                        disabled={isBusy}
                        onClick={() =>
                          setChangingRunnerUuid(isChanging ? null : runnerUuid)
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
                        onChangeRunner(runnerUuid, runner);
                        setChangingRunnerUuid(null);
                      }}
                      onCancel={() => setChangingRunnerUuid(null)}
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
