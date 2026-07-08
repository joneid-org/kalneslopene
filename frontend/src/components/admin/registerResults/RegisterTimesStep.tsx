import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import type { DraftEntry } from "@/model/DTO.ts";
import { AddRunnerForm } from "./AddRunnerForm.tsx";
import { TimeField } from "./TimeField.tsx";

export function RegisterTimesStep({
  entries,
  onAdd,
  onRemove,
  onUpdate,
}: {
  entries: DraftEntry[];
  onAdd: (entry: DraftEntry) => void;
  onRemove: (clientId: string) => void;
  onUpdate: (clientId: string, patch: Partial<DraftEntry>) => void;
}) {
  const existingRunnerUuids = new Set(
    entries.map((e) => e.runnerUuid).filter((u): u is string => u != null),
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

      <AddRunnerForm existingRunnerUuids={existingRunnerUuids} onAdd={onAdd} />

      {entries.length === 0 ? (
        <p className="text-sm italic text-muted-foreground">
          Ingen løpere registrert ennå.
        </p>
      ) : (
        <div className="divide-y overflow-hidden rounded-md border">
          {entries.map((entry) => (
            <div
              key={entry.clientId}
              className="flex items-center gap-2 px-3 py-2 text-sm"
            >
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate font-medium">{entry.name}</span>
                {entry.runnerUuid == null && (
                  <Badge variant="outline" className="shrink-0 py-0 text-xs">
                    Ny
                  </Badge>
                )}
              </div>
              <TimeField
                seconds={entry.resultTimeSeconds}
                disabled={entry.hideTime}
                onChange={(seconds) =>
                  onUpdate(entry.clientId, { resultTimeSeconds: seconds })
                }
                className="h-8 w-24 shrink-0 px-2 text-sm"
              />
              <label className="flex shrink-0 items-center gap-1.5 text-xs">
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
                Deltatt
              </label>
              <button
                type="button"
                className="shrink-0 text-destructive hover:text-destructive/80"
                onClick={() => onRemove(entry.clientId)}
                aria-label={`Fjern ${entry.name}`}
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
