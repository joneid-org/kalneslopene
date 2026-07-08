import { useQuery } from "@tanstack/react-query";
import { PlusIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { DraftEntry, RunnerDTO } from "@/model/DTO.ts";
import { genderLabel, newEntry } from "./helpers.ts";

export function AddRunnerForm({
  existingRunnerUuids,
  onAdd,
}: {
  existingRunnerUuids: Set<string>;
  onAdd: (entry: DraftEntry) => void;
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
    onAdd(
      newEntry({
        runnerUuid: r.uuid,
        name: r.name,
        gender: r.gender,
        createdThisSession: false,
      }),
    );
    reset();
  };

  const addNew = () => {
    const name = query.trim();
    if (!name) return;
    onAdd(
      newEntry({
        runnerUuid: null,
        name,
        gender: newGender,
        createdThisSession: true,
      }),
    );
    reset();
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1.5">
        <Label>Søk løper</Label>
        <Input
          placeholder="Skriv navn..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCreatingNew(false);
          }}
        />
      </div>

      {query.length > 0 && suggestions.length > 0 && !creatingNew && (
        <div className="max-h-40 divide-y overflow-y-auto rounded-md border bg-background">
          {suggestions.map((r) => (
            <button
              key={r.uuid}
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
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
              <Button className="flex-1 gap-1.5" onClick={addNew}>
                <UserPlusIcon className="size-4" />
                Legg til
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-1.5"
            onClick={() => setCreatingNew(true)}
          >
            <PlusIcon className="size-4" />
            Opprett «{query.trim()}» som ny løper
          </Button>
        ))}
    </div>
  );
}
