import { useQuery } from "@tanstack/react-query";
import { UserPlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatSecondsToTime, timeToSeconds } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";

export type QueuedRunner = {
  runner: RunnerDTO;
  resultTime: number;
  hideTime: boolean;
};

export function BulkAddRunnersForm({
  existing,
  pendingUuids,
  onAdd,
  onDone,
}: {
  existing: RaceRunnerDTO[];
  pendingUuids: Set<string | undefined>;
  onAdd: (runners: QueuedRunner[]) => void;
  onDone: () => void;
}) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<RunnerDTO | null>(null);
  const [time, setTime] = useState("");
  const [hideTime, setHideTime] = useState(false);
  const [queue, setQueue] = useState<QueuedRunner[]>([]);

  const existingUuids = new Set(existing.map((r) => r.runner.uuid));
  const queuedUuids = new Set(queue.map((q) => q.runner.uuid));

  const { data: searchResults } = useQuery({
    ...QUERIES.runner.getAllRunners(query),
    enabled: query.length > 0,
    staleTime: 0,
    gcTime: 0,
  });

  const suggestions = (searchResults ?? []).filter(
    (r) =>
      !existingUuids.has(r.uuid) &&
      !queuedUuids.has(r.uuid) &&
      !pendingUuids.has(r.uuid),
  );

  const showSuggestions = !selected && suggestions.length > 0;

  const handleAddToQueue = () => {
    if (!selected || (!time && !hideTime)) return;
    setQueue((prev) => [
      ...prev,
      {
        runner: selected,
        resultTime: hideTime ? 0 : timeToSeconds(time),
        hideTime,
      },
    ]);
    setSelected(null);
    setQuery("");
    setTime("");
    setHideTime(false);
  };

  const handleConfirm = () => {
    if (queue.length === 0) return;
    onAdd(queue);
    onDone();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Søk løper</Label>
        <Input
          placeholder="Skriv navn..."
          value={selected ? selected.name : query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
          }}
        />
        {showSuggestions && (
          <div className="border rounded-md divide-y max-h-36 overflow-y-auto">
            {suggestions.map((r) => (
              <button
                key={r.uuid}
                type="button"
                className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                onClick={() => {
                  setSelected(r);
                  setQuery("");
                }}
              >
                {r.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 items-end">
        <div className="flex-1 space-y-1.5">
          <Label>Tid (mm:ss eller hh:mm:ss)</Label>
          <Input
            placeholder="23:45"
            value={time}
            disabled={hideTime}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 pb-0.5">
          <input
            id="hideTimeBulk"
            type="checkbox"
            checked={hideTime}
            onChange={(e) => setHideTime(e.target.checked)}
            aria-label="Kun deltatt (skjul tid)"
            className="rounded"
          />
          <Label htmlFor="hideTimeBulk" className="whitespace-nowrap">
            Kun deltatt
          </Label>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full gap-1.5"
        disabled={!selected || (!time && !hideTime)}
        onClick={handleAddToQueue}
      >
        <UserPlusIcon className="size-4" />
        Legg til i listen
      </Button>

      {queue.length > 0 && (
        <>
          <Separator />
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Klar til lagring ({queue.length})
          </p>
          <div className="border rounded-md divide-y max-h-44 overflow-y-auto">
            {queue.map((q) => (
              <div
                key={q.runner.uuid}
                className="flex items-center justify-between px-3 py-1.5 text-sm"
              >
                <span className="font-medium">{q.runner.name}</span>
                <div className="flex items-center gap-3">
                  <span className="tabular-nums font-mono text-muted-foreground">
                    {q.hideTime ? "Deltatt" : formatSecondsToTime(q.resultTime)}
                  </span>
                  <button
                    type="button"
                    className="text-destructive hover:text-destructive/80"
                    onClick={() =>
                      setQueue((prev) =>
                        prev.filter((r) => r.runner.uuid !== q.runner.uuid),
                      )
                    }
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onDone}>
          Avbryt
        </Button>
        <Button disabled={queue.length === 0} onClick={handleConfirm}>
          Legg til{" "}
          {queue.length > 0
            ? `${queue.length} løper${queue.length > 1 ? "e" : ""}`
            : ""}
        </Button>
      </DialogFooter>
    </div>
  );
}
