import {
  CheckIcon,
  Loader2Icon,
  LogOutIcon,
  ReplaceIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import { WEATHER_SYMBOL_OPTIONS } from "@/lib/weatherDisplay.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";
import { ChangeRunnerField } from "./ChangeRunnerField.tsx";
import { entrySeconds, genderLabel, type WeatherForm } from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

const WEATHER_NUMBER_FIELDS: {
  key: "temperature" | "windSpeed" | "precipitation";
  label: string;
}[] = [
  { key: "temperature", label: "Temp (°C)" },
  { key: "windSpeed", label: "Vind (m/s)" },
  { key: "precipitation", label: "Nedbør (mm)" },
];

export function ReviewStep({
  entries,
  weather,
  onWeatherChange,
  onWeatherPersist,
  courseCondition,
  onCourseConditionChange,
  onCourseConditionPersist,
  onUpdateResult,
  onUpdateRunner,
  onRemove,
  onVerifyRunner,
  onChangeRunner,
  busyRunnerUuid,
  onClose,
}: {
  entries: RaceRunnerDTO[];
  weather: WeatherForm;
  onWeatherChange: (weather: WeatherForm) => void;
  onWeatherPersist: (weather: WeatherForm) => void;
  courseCondition: string;
  onCourseConditionChange: (value: string) => void;
  onCourseConditionPersist: (value: string) => void;
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
  onClose?: () => void;
}) {
  const [changingRunnerUuid, setChangingRunnerUuid] = useState<string | null>(
    null,
  );

  const sortedEntries = [...entries].sort((a, b) => {
    const secondsA = entrySeconds(a);
    const secondsB = entrySeconds(b);
    if (secondsA != null && secondsB != null) return secondsA - secondsB;
    if (secondsA != null) return -1;
    if (secondsB != null) return 1;
    return a.runner.name.localeCompare(b.runner.name, "nb");
  });

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
        <p className="text-xs text-muted-foreground">
          Hentet automatisk fra Yr. Overstyr ved behov.
        </p>
        <Select
          value={weather.symbol}
          onValueChange={(symbol) => {
            const next = { ...weather, symbol };
            onWeatherChange(next);
            onWeatherPersist(next);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Velg værtype" />
          </SelectTrigger>
          <SelectContent>
            {WEATHER_SYMBOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="grid grid-cols-3 gap-2">
          {WEATHER_NUMBER_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label className="text-xs font-normal text-muted-foreground">
                {label}
              </Label>
              <Input
                type="number"
                inputMode="decimal"
                step="any"
                value={weather[key]}
                onChange={(e) =>
                  onWeatherChange({ ...weather, [key]: e.target.value })
                }
                onBlur={() => onWeatherPersist(weather)}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Løypeforhold</Label>
        <Input
          placeholder="f.eks. Tørt og fint"
          value={courseCondition}
          onChange={(e) => onCourseConditionChange(e.target.value)}
          onBlur={() => onCourseConditionPersist(courseCondition)}
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
            {sortedEntries.map((entry) => {
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

      {onClose && (
        <Button variant="outline" className="w-full gap-1.5" onClick={onClose}>
          <LogOutIcon className="size-4" />
          Lukk
        </Button>
      )}
    </div>
  );
}
