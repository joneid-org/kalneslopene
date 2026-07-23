import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";
import { AddRunnerForm } from "./AddRunnerForm.tsx";
import { entrySeconds } from "./helpers.ts";
import { TimeField } from "./TimeField.tsx";

export function RegisterTimesStep({
  entries,
  onAddExisting,
  onAddNew,
  onRemove,
  onUpdateResult,
  isAdding,
}: {
  entries: RaceRunnerDTO[];
  onAddExisting: (runner: RunnerDTO) => void;
  onAddNew: (name: string, gender: string) => void;
  onRemove: (runnerUuid: string) => void;
  onUpdateResult: (
    runnerUuid: string,
    patch: { resultTime?: string; hideTime?: boolean },
  ) => void;
  isAdding: boolean;
}) {
  const existingRunnerUuids = new Set(entries.map((e) => e.runner.uuid));
  const sortedEntries = [...entries].sort((a, b) =>
    a.runner.name.localeCompare(b.runner.name, "nb"),
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Registrer tider</h2>
        <p className="text-sm text-muted-foreground">
          Legg inn tid etter hvert som løperne kommer i mål. Du kan også legge
          til løpere du glemte.
        </p>
      </div>

      <AddRunnerForm
        existingRunnerUuids={existingRunnerUuids}
        onAddExisting={onAddExisting}
        onAddNew={onAddNew}
        isAdding={isAdding}
      />

      {entries.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">
          Ingen løpere registrert ennå.
        </p>
      ) : (
        <div className="divide-y overflow-hidden rounded-md border">
          {sortedEntries.map((entry) => (
            <div
              key={entry.runner.uuid}
              className="flex items-center gap-2 px-3 py-2 text-sm"
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
                onChange={(seconds) =>
                  onUpdateResult(entry.runner.uuid, {
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
                    onUpdateResult(entry.runner.uuid, {
                      hideTime: e.target.checked,
                      ...(e.target.checked ? { resultTime: "PT0S" } : {}),
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
