import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2Icon, PlusIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useRunnerSearch } from "@/hooks/useRunnerSearch.ts";
import type { RunnerDTO, RunnerInput } from "@/model/DTO.ts";
import {
  genderLabel,
  type RunnerFormValues,
  runnerFormSchema,
} from "./helpers.ts";

export function AddRunnerForm({
  existingRunnerUuids,
  onAdd,
  isAdding = false,
}: {
  existingRunnerUuids: Set<string>;
  onAdd: (runner: RunnerDTO | RunnerInput) => void;
  isAdding?: boolean;
}) {
  const [creatingNew, setCreatingNew] = useState(false);
  const { register, handleSubmit, watch, setValue, reset, formState } =
    useForm<RunnerFormValues>({
      defaultValues: { name: "", gender: "MALE" },
      resolver: standardSchemaResolver(runnerFormSchema),
    });

  const query = watch("name");
  const name = query.trim();
  const gender = watch("gender");
  const { runners: suggestions } = useRunnerSearch(query, {
    excludeUuids: existingRunnerUuids,
  });

  const add = (runner: RunnerDTO | RunnerInput) => {
    onAdd(runner);
    reset();
    setCreatingNew(false);
  };

  const addNew = handleSubmit(add);

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1.5">
        <Label htmlFor="runnerName">Søk løper</Label>
        <div className="flex items-center gap-2">
          <Input
            id="runnerName"
            placeholder="Skriv navn..."
            aria-invalid={!!formState.errors.name}
            aria-describedby={formState.errors.name && "runnerName-error"}
            {...register("name", { onChange: () => setCreatingNew(false) })}
          />
          {isAdding && (
            <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>
        {formState.errors.name && (
          <p id="runnerName-error" className="text-xs text-destructive">
            {formState.errors.name.message}
          </p>
        )}
      </div>

      {name.length > 0 && suggestions.length > 0 && !creatingNew && (
        <div className="max-h-40 divide-y overflow-y-auto rounded-md border bg-background">
          {suggestions.map((r) => (
            <button
              key={r.uuid}
              type="button"
              disabled={isAdding}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
              onClick={() => add(r)}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {genderLabel(r.gender)}
              </span>
            </button>
          ))}
        </div>
      )}

      {name.length > 0 &&
        (creatingNew ? (
          <div className="space-y-3 rounded-md border bg-background p-3">
            <p className="text-sm">
              Ny løper: <span className="font-semibold">{name}</span>
            </p>
            <div className="space-y-1.5">
              <Label>Kjønn</Label>
              <div className="flex gap-3">
                {(["MALE", "FEMALE"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setValue("gender", g)}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      gender === g
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background hover:bg-muted"
                    }`}
                  >
                    {genderLabel(g)}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                onClick={() => setCreatingNew(false)}
              >
                Avbryt
              </Button>
              <Button
                className="flex-1 gap-1.5"
                disabled={isAdding}
                onClick={addNew}
              >
                <UserPlusIcon className="size-4" />
                Legg til
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-1.5"
            disabled={isAdding}
            onClick={() => setCreatingNew(true)}
          >
            <PlusIcon className="size-4" />
            Opprett «{name}» som ny løper
          </Button>
        ))}
    </div>
  );
}
