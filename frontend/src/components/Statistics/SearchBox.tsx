import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

type Props = {
  onSelect: (runner: RunnerDTO) => void;
};

export default function SearchBox({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { data, isFetching } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const runners = (data ?? []).filter((r) => r.isVerified);
  const showResults = query.length > 0 && !isFetching;

  const handleSelect = (runner: RunnerDTO) => {
    onSelect(runner);
    setSelectedName(runner.name);
    setQuery("");
  };

  return (
    <Command
      shouldFilter={false}
      className="rounded-[14px] border bg-card **:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-4"
    >
      <CommandInput
        placeholder={selectedName ?? "Søk etter løper..."}
        value={query}
        onValueChange={setQuery}
      />
      {showResults && (
        <CommandList className="border-t">
          {!runners?.length ? (
            <CommandEmpty>Ingen løpere funnet.</CommandEmpty>
          ) : (
            <CommandGroup>
              {runners.map((runner) => (
                <CommandItem
                  key={runner.uuid ?? runner.name}
                  value={runner.uuid ?? runner.name}
                  onSelect={() => handleSelect(runner)}
                >
                  {runner.name}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      )}
    </Command>
  );
}
