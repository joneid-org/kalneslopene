import RunnerSearchBox from "@/components/RunnerSearchBox.tsx";
import { Button } from "@/components/ui/button.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

export function ChangeRunnerField({
  excludeRunnerUuids,
  onPick,
  onCancel,
}: {
  excludeRunnerUuids: Set<string>;
  onPick: (runner: RunnerDTO) => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-muted/30 p-2">
      <RunnerSearchBox
        onSelect={onPick}
        excludeUuids={excludeRunnerUuids}
        placeholder="Søk etter riktig løper..."
        className="flex-1 rounded-md **:data-[slot=command-input-wrapper]:h-8"
      />
      <Button variant="ghost" size="sm" className="h-8" onClick={onCancel}>
        Avbryt
      </Button>
    </div>
  );
}
