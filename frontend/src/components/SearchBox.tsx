import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const { data: runners, isFetching } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const handleSelect = (runner: RunnerDTO) => {
    onSelect(runner);
    setSelectedName(runner.name);
    setQuery("");
    setOpen(false);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <SearchIcon className="size-4 text-primary" />
          Søk etter løper
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Command className="border rounded-lg" shouldFilter={false}>
          <CommandInput
            placeholder={selectedName ?? "Skriv et navn..."}
            value={query}
            onValueChange={(val) => {
              setQuery(val);
              setOpen(val.length > 0);
            }}
            onFocus={() => setOpen(query.length > 0)}
          />
          {open && !isFetching && (
            <CommandList>
              {(runners ?? []).length === 0 ? (
                <CommandEmpty>Ingen løpere funnet.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {(runners ?? []).map((runner) => (
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
      </CardContent>
    </Card>
  );
}
