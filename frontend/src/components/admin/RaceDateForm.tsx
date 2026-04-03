import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";

export function RaceDateForm({
  initialDate = "",
  submitLabel,
  isPending,
  onSubmit,
  onCancel,
}: {
  initialDate?: string;
  submitLabel: string;
  isPending: boolean;
  onSubmit: (raceDate: string) => void;
  onCancel: () => void;
}) {
  const [raceDate, setRaceDate] = useState(initialDate);

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Dato og tid</Label>
        <Input
          type="datetime-local"
          value={raceDate}
          onChange={(e) => setRaceDate(e.target.value)}
        />
      </div>
      <FormFooter
        submitLabel={submitLabel}
        disabled={!raceDate || isPending}
        onCancel={onCancel}
        onSubmit={() => onSubmit(raceDate)}
      />
    </div>
  );
}
