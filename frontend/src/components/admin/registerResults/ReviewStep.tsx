import {
  CheckIcon,
  ChevronsUpDownIcon,
  Loader2Icon,
  LogOutIcon,
  PlusIcon,
  ReplaceIcon,
  XIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import { cn } from "@/lib/utils.ts";
import {
  WEATHER_SYMBOL_OPTIONS,
  WIND_DIRECTION_OPTIONS,
  windDirectionSector,
} from "@/lib/weatherDisplay.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";
import { ChangeRunnerField } from "./ChangeRunnerField.tsx";
import {
  entrySeconds,
  genderLabel,
  type RaceForm,
  type RaceValues,
  runnerFormSchema,
} from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

const WEATHER_NUMBER_FIELDS: {
  key: "temperature" | "windSpeed";
  label: string;
}[] = [
  { key: "temperature", label: "Temp (°C)" },
  { key: "windSpeed", label: "Vind (m/s)" },
];

/** Combobox for værtype: pick a known Yr symbol, or type a free-text description and add it. */
function WeatherTypeCombobox({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [customOptions, setCustomOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!value) return;
    if (WEATHER_SYMBOL_OPTIONS.some((opt) => opt.value === value)) return;
    setCustomOptions((prev) =>
      prev.includes(value) ? prev : [...prev, value],
    );
  }, [value]);

  const options = [
    ...WEATHER_SYMBOL_OPTIONS,
    ...customOptions.map((v) => ({ value: v, label: v })),
  ];
  const selectedLabel = options.find((opt) => opt.value === value)?.label;

  function select(next: string) {
    onSelect(next);
    setSearch("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{selectedLabel ?? "Velg værtype"}</span>
          <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
        <Command>
          <CommandInput
            placeholder="Søk eller skriv en værtype…"
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Ingen treff.</CommandEmpty>
            <CommandGroup>
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  value={opt.label}
                  onSelect={() => select(opt.value)}
                >
                  <CheckIcon
                    className={cn(
                      "size-4",
                      value === opt.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {opt.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {search.trim() && (
              <CommandGroup>
                <CommandItem
                  value={`__custom__${search.trim()}`}
                  onSelect={() => select(search.trim())}
                >
                  <PlusIcon className="size-4" />
                  Bruk egendefinert værforhold: «{search.trim()}»
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

/** Same name rules as when the runner was created — nothing is saved on a failure. */
function RunnerNameField({
  entry,
  onCommit,
}: {
  entry: RaceRunnerDTO;
  onCommit: (name: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const errorId = `${entry.runner.uuid}-name-error`;

  return (
    <div className="flex-1 space-y-1">
      <Input
        defaultValue={entry.runner.name}
        aria-label="Navn"
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        onBlur={(e) => {
          const parsed = runnerFormSchema.shape.name.safeParse(e.target.value);
          setError(parsed.success ? null : parsed.error.issues[0].message);
          if (parsed.success && parsed.data !== entry.runner.name)
            onCommit(parsed.data);
        }}
        className="h-8 text-sm"
      />
      {error && (
        <p id={errorId} className="text-xs text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function ReviewStep({
  entries,
  form,
  onPersistRace,
  onUpdateResult,
  onUpdateRunner,
  onRemove,
  onVerifyRunner,
  onChangeRunner,
  busyRunnerUuid,
  onClose,
}: {
  entries: RaceRunnerDTO[];
  form: UseFormReturn<RaceForm, unknown, RaceValues>;
  onPersistRace: () => void;
  onUpdateResult: (entry: RaceRunnerDTO) => void;
  onUpdateRunner: (entry: RaceRunnerDTO, patch: Partial<RunnerDTO>) => void;
  onRemove: (runnerUuid: string) => void;
  onVerifyRunner: (runner: RunnerDTO) => void;
  onChangeRunner: (entry: RaceRunnerDTO, runner: RunnerDTO) => void;
  busyRunnerUuid: string | null;
  onClose?: () => void;
}) {
  const [changingRunnerUuid, setChangingRunnerUuid] = useState<string | null>(
    null,
  );
  const { errors } = form.formState;

  const excludeUuids = new Set(entries.map((e) => e.runner.uuid));
  const sortedEntries = entries.toSorted((a, b) => {
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
        <Controller
          control={form.control}
          name="symbol"
          render={({ field }) => (
            <WeatherTypeCombobox
              value={field.value}
              onSelect={(symbol) => {
                field.onChange(symbol);
                onPersistRace();
              }}
            />
          )}
        />

        <div className="grid grid-cols-3 gap-2">
          {WEATHER_NUMBER_FIELDS.map(({ key, label }) => (
            <div key={key} className="space-y-1">
              <Label
                htmlFor={key}
                className="text-xs font-normal text-muted-foreground"
              >
                {label}
              </Label>
              <Input
                id={key}
                type="number"
                inputMode="decimal"
                step="any"
                aria-invalid={!!errors[key]}
                aria-describedby={errors[key] && `${key}-error`}
                {...form.register(key, { onBlur: onPersistRace })}
              />
              {errors[key] && (
                <p id={`${key}-error`} className="text-xs text-destructive">
                  {errors[key]?.message}
                </p>
              )}
            </div>
          ))}
          <div className="space-y-1">
            <Label className="text-xs font-normal text-muted-foreground">
              Retning
            </Label>
            <Controller
              control={form.control}
              name="windDirection"
              render={({ field }) => (
                <Select
                  value={
                    field.value != null
                      ? windDirectionSector(field.value).toString()
                      : ""
                  }
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    onPersistRace();
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="—" />
                  </SelectTrigger>
                  <SelectContent>
                    {WIND_DIRECTION_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value.toString()}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="courseCondition">Løypeforhold</Label>
        <Input
          id="courseCondition"
          placeholder="f.eks. Tørt og fint"
          aria-invalid={!!errors.courseCondition}
          aria-describedby={errors.courseCondition && "courseCondition-error"}
          {...form.register("courseCondition", { onBlur: onPersistRace })}
        />
        {errors.courseCondition && (
          <p id="courseCondition-error" className="text-xs text-destructive">
            {errors.courseCondition.message}
          </p>
        )}
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
              const { uuid: runnerUuid, name, gender } = entry.runner;
              const isNew = !entry.runner.isVerified;
              const isBusy = busyRunnerUuid === runnerUuid;

              return (
                <div
                  key={runnerUuid}
                  className="space-y-2 rounded-md border p-3"
                >
                  <div className="flex items-center gap-2">
                    {isNew ? (
                      <RunnerNameField
                        entry={entry}
                        onCommit={(newName) =>
                          onUpdateRunner(entry, { name: newName })
                        }
                      />
                    ) : (
                      <span className="flex-1 truncate text-sm font-medium">
                        {name}
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
                      aria-label={`Fjern ${name}`}
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
                            onClick={() => onUpdateRunner(entry, { gender: g })}
                            className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                              gender.toUpperCase() === g
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
                        {genderLabel(gender)}
                      </span>
                    )}
                    <TimeField
                      seconds={entrySeconds(entry)}
                      disabled={entry.hideTime}
                      onBlur={(seconds) =>
                        onUpdateResult({
                          ...entry,
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
                          onUpdateResult({
                            ...entry,
                            hideTime: e.target.checked,
                            ...(e.target.checked ? { resultTime: null } : {}),
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
                        onClick={() => onVerifyRunner(entry.runner)}
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
                          setChangingRunnerUuid(
                            changingRunnerUuid === runnerUuid
                              ? null
                              : runnerUuid,
                          )
                        }
                      >
                        <ReplaceIcon className="size-3.5" />
                        Bytt løper
                      </Button>
                    )}
                  </div>

                  {changingRunnerUuid === runnerUuid && !isNew && (
                    <ChangeRunnerField
                      excludeRunnerUuids={excludeUuids}
                      onPick={(runner) => {
                        onChangeRunner(entry, runner);
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
