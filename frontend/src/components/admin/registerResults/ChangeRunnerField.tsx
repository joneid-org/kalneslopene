import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";
import { genderLabel } from "./helpers.ts";

export function ChangeRunnerField({
  excludeRunnerUuids,
  onPick,
  onCancel,
}: {
  excludeRunnerUuids: Set<string>;
  onPick: (runner: RunnerDTO) => void;
  onCancel: () => void;
}) {
  const [query, setQuery] = useState("");

  const { data } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const suggestions = (data ?? []).filter(
    (r) => !excludeRunnerUuids.has(r.uuid),
  );

  return (
    <div className="space-y-2 rounded-md border bg-muted/30 p-2">
      <div className="flex gap-2">
        <Input
          autoFocus
          placeholder="Søk etter riktig løper..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-8 text-sm"
        />
        <Button variant="ghost" size="sm" className="h-8" onClick={onCancel}>
          Avbryt
        </Button>
      </div>
      {query.length > 0 && suggestions.length > 0 && (
        <div className="max-h-40 divide-y overflow-y-auto rounded-md border bg-background">
          {suggestions.map((r) => (
            <button
              key={r.uuid}
              type="button"
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
              onClick={() => onPick(r)}
            >
              <span className="font-medium">{r.name}</span>
              <span className="text-xs text-muted-foreground">
                {genderLabel(r.gender)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
