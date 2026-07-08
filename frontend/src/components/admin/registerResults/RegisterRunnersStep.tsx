import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import type { DraftEntry } from "@/model/DTO.ts";
import { AddRunnerForm } from "./AddRunnerForm.tsx";
import { genderLabel } from "./helpers.ts";

export function RegisterRunnersStep({
  entries,
  onAdd,
  onRemove,
}: {
  entries: DraftEntry[];
  onAdd: (entry: DraftEntry) => void;
  onRemove: (clientId: string) => void;
}) {
  const existingRunnerUuids = new Set(
    entries.map((e) => e.runnerUuid).filter((u): u is string => u != null),
  );

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Registrer løpere</h2>
        <p className="text-sm text-muted-foreground">
          Søk opp løpere fra databasen, eller opprett nye. Nye løpere lagres
          ikke i databasen ennå.
        </p>
      </div>

      <AddRunnerForm existingRunnerUuids={existingRunnerUuids} onAdd={onAdd} />

      <div className="space-y-2">
        <p className="text-sm font-medium">
          Påmeldte løpere{" "}
          <span className="text-muted-foreground">({entries.length})</span>
        </p>
        {entries.length === 0 ? (
          <p className="text-sm italic text-muted-foreground">
            Ingen løpere registrert ennå.
          </p>
        ) : (
          <div className="divide-y overflow-hidden rounded-md border">
            {entries.map((entry) => (
              <div
                key={entry.clientId}
                className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {genderLabel(entry.gender)}
                  </span>
                  {entry.runnerUuid == null && (
                    <Badge variant="outline" className="py-0 text-xs">
                      Ny
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  className="text-destructive hover:text-destructive/80"
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
    </div>
  );
}
