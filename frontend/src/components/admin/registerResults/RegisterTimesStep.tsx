import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO, RunnerInput } from "@/model/DTO.ts";
import { AddRunnerForm } from "./AddRunnerForm.tsx";
import { entryHasTime, entrySeconds } from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

export function RegisterTimesStep({
  entries,
  onAdd,
  onRemove,
  onUpdateResult,
  isAdding,
}: {
  entries: RaceRunnerDTO[];
  onAdd: (runner: RunnerDTO | RunnerInput) => void;
  onRemove: (runnerUuid: string) => void;
  onUpdateResult: (entry: RaceRunnerDTO) => void;
  isAdding: boolean;
}) {
  const sortedEntries = entries.toSorted((a, b) =>
    a.runner.name.localeCompare(b.runner.name, "nb"),
  );
  const [registered, missing] = sortedEntries.partition(entryHasTime);

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Registrer tider</h2>
        <p className="text-sm text-muted-foreground">
          Legg inn tid etter hvert som løperne kommer i mål. Du kan også legge
          til løpere du glemte.
        </p>
      </div>

      {entries.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">
          Ingen løpere registrert ennå.
        </p>
      ) : (
        <div className="space-y-6">
          <EntryTable
            title="Mangler tid"
            entries={missing}
            emptyText="Alle løperne har fått tid."
            onRemove={onRemove}
            onUpdateResult={onUpdateResult}
          />
          <EntryTable
            title="Ferdig registrert"
            entries={registered}
            emptyText="Ingen løpere har fått tid ennå."
            onRemove={onRemove}
            onUpdateResult={onUpdateResult}
          />
        </div>
      )}

      <AddRunnerForm
        existingRunnerUuids={new Set(entries.map((e) => e.runner.uuid))}
        onAdd={onAdd}
        isAdding={isAdding}
      />
    </div>
  );
}

function EntryTable({
  title,
  entries,
  emptyText,
  onRemove,
  onUpdateResult,
}: {
  title: string;
  entries: RaceRunnerDTO[];
  emptyText: string;
  onRemove: (runnerUuid: string) => void;
  onUpdateResult: (entry: RaceRunnerDTO) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold">
        {title}{" "}
        <span className="font-normal text-muted-foreground">
          ({entries.length})
        </span>
      </h3>
      {entries.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">{emptyText}</p>
      ) : (
        <div className="divide-y overflow-hidden rounded-md border">
          {entries.map((entry) => (
            <div
              key={entry.runner.uuid}
              className="flex items-center gap-2 px-3 py-2 text-sm even:bg-muted/50"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate font-medium">
                  {entry.runner.name}
                </span>
                {!entry.runner.isVerified && (
                  <Badge variant="outline" className="shrink-0 py-0 text-xs">
                    Ny
                  </Badge>
                )}
              </div>
              <TimeField
                seconds={entrySeconds(entry)}
                disabled={entry.hideTime}
                onBlur={(seconds) =>
                  onUpdateResult({
                    ...entry,
                    resultTime: secondsToDuration(seconds ?? 0),
                  })
                }
                className="h-8 w-24 shrink-0 px-2 text-sm"
              />
              <label className="flex shrink-0 items-center gap-1.5 text-xs">
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
                Deltatt
              </label>
              <button
                type="button"
                className="shrink-0 text-destructive hover:text-destructive/80"
                onClick={() => onRemove(entry.runner.uuid)}
                aria-label={`Fjern ${entry.runner.name}`}
              >
                <XIcon className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
