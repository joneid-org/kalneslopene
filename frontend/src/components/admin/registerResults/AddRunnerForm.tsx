import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";
import { genderLabel } from "./helpers.ts";

export function AddRunnerForm({
  existingRunnerUuids,
  onAddExisting,
  onAddNew,
  isAdding = false,
}: {
  existingRunnerUuids: Set<string>;
  onAddExisting: (runner: RunnerDTO) => void;
  onAddNew: (name: string, gender: string) => void;
  isAdding?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [creatingNew, setCreatingNew] = useState(false);
  const [newGender, setNewGender] = useState<"MALE" | "FEMALE">("MALE");

  const { data: searchResults } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const suggestions = (searchResults ?? []).filter(
    (r) => !existingRunnerUuids.has(r.uuid),
  );

  const reset = () => {
    setQuery("");
    setCreatingNew(false);
    setNewGender("MALE");
  };

  const addExisting = (r: RunnerDTO) => {
    onAddExisting(r);
    reset();
  };

  const addNew = () => {
    const name = query.trim();
    if (!name) return;
    onAddNew(name, newGender);
    reset();
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1.5">
        <Label>Søk løper</Label>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Skriv navn..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setCreatingNew(false);
            }}
          />
          {isAdding && (
            <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>
      </div>

      {query.length > 0 && suggestions.length > 0 && !creatingNew && (
        <div className="max-h-40 divide-y overflow-y-auto rounded-md border bg-background">
          {suggestions.map((r) => (
            <button
              key={r.uuid}
              type="button"
              disabled={isAdding}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50"
              onClick={() => addExisting(r)}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {genderLabel(r.gender)}
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length > 0 &&
        (creatingNew ? (
          <div className="space-y-3 rounded-md border bg-background p-3">
            <p className="text-sm">
              Ny løper: <span className="font-semibold">{query.trim()}</span>
            </p>
            <div className="space-y-1.5">
              <Label>Kjønn</Label>
              <div className="flex gap-3">
                {(["MALE", "FEMALE"] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setNewGender(g)}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                      newGender === g
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
            Opprett «{query.trim()}» som ny løper
          </Button>
        ))}
    </div>
  );
}
