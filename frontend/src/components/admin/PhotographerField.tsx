import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { MUTATIONS } from "@/api/mutations.ts";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

type PhotographerFieldProps = {
  raceUuid: string;
  photographer?: string;
  onSaved: () => void;
};

export function PhotographerField({
  raceUuid,
  photographer,
  onSaved,
}: PhotographerFieldProps) {
  const [value, setValue] = useState(photographer ?? "");
  const mutation = useMutation({
    mutationFn: (name: string) =>
      MUTATIONS.race.updatePhotographer(raceUuid, name),
    onSuccess: () => {
      toast.success("Fotograf lagret");
      onSaved();
    },
  });

  const save = () => {
    if (value.trim() === (photographer ?? "")) return;
    mutation.mutate(value);
  };

  const inputId = `photographer-${raceUuid}`;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>Fotograf</Label>
      <Input
        id={inputId}
        value={value}
        placeholder="Navn på fotograf (valgfritt)"
        onChange={(e) => setValue(e.target.value)}
        onBlur={save}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        disabled={mutation.isPending}
      />
    </div>
  );
}
