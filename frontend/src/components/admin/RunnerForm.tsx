import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

export function RunnerForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<RunnerDTO>;
  onSubmit: (runner: Omit<RunnerDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [gender, setGender] = useState(initial.gender ?? "");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Navn</Label>
        <Input
          placeholder="Fornavn Etternavn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-1.5">
        <Label>Kjønn</Label>
        <div className="flex gap-3">
          {["Mann", "Kvinne"].map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => setGender(g)}
              className={`flex-1 rounded-md border px-3 py-2 text-sm transition-colors ${
                gender === g
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>
      <FormFooter
        submitLabel={submitLabel}
        disabled={!name.trim() || !gender}
        onCancel={onCancel}
        onSubmit={() => onSubmit({ name: name.trim(), gender })}
      />
    </div>
  );
}
