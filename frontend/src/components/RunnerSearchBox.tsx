import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command.tsx";
import { useRunnerSearch } from "@/hooks/useRunnerSearch.ts";
import { cn } from "@/lib/utils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

type Props = {
  onSelect: (runner: RunnerDTO) => void;
  isVerifiedOnly?: boolean;
  excludeUuids?: Set<string>;
  placeholder?: string;
  className?: string;
};

export default function RunnerSearchBox({
  onSelect,
  isVerifiedOnly,
  excludeUuids,
  placeholder = "Søk etter løper...",
  className,
}: Props) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { runners, isLoading } = useRunnerSearch(query, {
    isVerifiedOnly,
    excludeUuids,
  });
  const showResults = query.length > 0 && !isLoading;

  const handleSelect = (runner: RunnerDTO) => {
    onSelect(runner);
    setSelectedName(runner.name);
    setQuery("");
  };

  return (
    <Command
      shouldFilter={false}
      className={cn(
        "rounded-[14px] border bg-card **:data-[slot=command-input-wrapper]:h-12 **:data-[slot=command-input-wrapper]:border-0 **:data-[slot=command-input-wrapper]:px-4",
        className,
      )}
    >
      <CommandInput
        className="text-base"
        placeholder={selectedName ?? placeholder}
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
