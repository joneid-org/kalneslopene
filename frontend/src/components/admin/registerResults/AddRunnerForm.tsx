import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Loader2Icon, PlusIcon, UserPlusIcon } from "lucide-react";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Kbd } from "@/components/Kbd.tsx";
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
  focusOnMount = false,
}: {
  existingRunnerUuids: Set<string>;
  onAdd: (runner: RunnerDTO | RunnerInput) => void;
  isAdding?: boolean;
  focusOnMount?: boolean;
}) {
  const [creatingNew, setCreatingNew] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);
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

  const showSuggestions =
    name.length > 0 && suggestions.length > 0 && !creatingNew;
  const activeIndex = Math.min(highlight, suggestions.length - 1);

  const { ref: registerNameRef, ...nameField } = register("name", {
    onChange: () => {
      setCreatingNew(false);
      setHighlight(0);
    },
  });

  useEffect(() => {
    if (focusOnMount) inputRef.current?.focus();
  }, [focusOnMount]);

  useEffect(() => {
    optionRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const add = (runner: RunnerDTO | RunnerInput) => {
    onAdd(runner);
    reset();
    setCreatingNew(false);
    setHighlight(0);
    inputRef.current?.focus();
  };

  const addNew = handleSubmit(add);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      if (creatingNew) setCreatingNew(false);
      else reset();
      return;
    }
    if (e.key === "ArrowDown" && showSuggestions) {
      e.preventDefault();
      setHighlight(Math.min(activeIndex + 1, suggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp" && showSuggestions) {
      e.preventDefault();
      setHighlight(Math.max(activeIndex - 1, 0));
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (isAdding || name.length === 0) return;
      if (showSuggestions) add(suggestions[activeIndex]);
      else if (creatingNew) addNew();
      else setCreatingNew(true);
    }
  };

  return (
    <div className="space-y-3 rounded-lg border bg-muted/30 p-3">
      <div className="space-y-1.5">
        <Label htmlFor="runnerName">Søk løper</Label>
        <div className="flex items-center gap-2">
          <Input
            id="runnerName"
            placeholder="Skriv navn..."
            autoComplete="off"
            aria-invalid={!!formState.errors.name}
            aria-describedby={
              formState.errors.name ? "runnerName-error" : "runnerName-hint"
            }
            onKeyDown={onKeyDown}
            {...nameField}
            ref={(element) => {
              registerNameRef(element);
              inputRef.current = element;
            }}
          />
          {isAdding && (
            <Loader2Icon className="size-4 shrink-0 animate-spin text-muted-foreground" />
          )}
        </div>
        {formState.errors.name ? (
          <p id="runnerName-error" className="text-xs text-destructive">
            {formState.errors.name.message}
          </p>
        ) : (
          <p id="runnerName-hint" className="text-xs text-muted-foreground">
            <Kbd>↑</Kbd> <Kbd>↓</Kbd> for å velge, <Kbd>Enter</Kbd> for å legge
            til, <Kbd>Esc</Kbd> for å tømme.
          </p>
        )}
      </div>

      {showSuggestions && (
        <div className="max-h-40 divide-y overflow-y-auto rounded-md border bg-background">
          {suggestions.map((r, index) => (
            <button
              key={r.uuid}
              type="button"
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              disabled={isAdding}
              data-highlighted={index === activeIndex}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted disabled:opacity-50 data-[highlighted=true]:bg-muted"
              onMouseEnter={() => setHighlight(index)}
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
