import { XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";
import { AddRunnerForm } from "./AddRunnerForm.tsx";
import { genderLabel } from "./helpers.ts";

export function RegisterRunnersStep({
  entries,
  onAddExisting,
  onAddNew,
  onRemove,
  isAdding,
}: {
  entries: RaceRunnerDTO[];
  onAddExisting: (runner: RunnerDTO) => void;
  onAddNew: (name: string, gender: string) => void;
  onRemove: (runnerUuid: string) => void;
  isAdding: boolean;
}) {
  const existingRunnerUuids = new Set(entries.map((e) => e.runner.uuid));

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Registrer løpere</h2>
        <p className="text-sm text-muted-foreground">
          Søk opp løpere fra databasen, eller opprett nye. Nye løpere lagres med
          en gang, men er ikke bekreftet før du bekrefter dem.
        </p>
      </div>

      <AddRunnerForm
        existingRunnerUuids={existingRunnerUuids}
        onAddExisting={onAddExisting}
        onAddNew={onAddNew}
        isAdding={isAdding}
      />

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
            {[...entries].reverse().map((entry) => (
              <div
                key={entry.runner.uuid}
                className="flex items-center justify-between gap-2 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{entry.runner.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {genderLabel(entry.runner.gender)}
                  </span>
                  {!entry.runner.isVerified && (
                    <Badge variant="outline" className="py-0 text-xs">
                      Ny
                    </Badge>
                  )}
                </div>
                <button
                  type="button"
                  className="text-destructive hover:text-destructive/80"
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
    </div>
  );
}
