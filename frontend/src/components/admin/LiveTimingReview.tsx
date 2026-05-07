import { useQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  PencilIcon,
  UserIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { Input } from "@/components/ui/input.tsx";
import { formatSecondsToTime, timeToSeconds } from "@/lib/timeUtils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";
import type { FinishSlot } from "@/pages/admin/LiveTiming.tsx";

export function LiveTimingReview({
  startList,
  slots,
  onSlotsChange,
  isSaving,
  isError,
  onSave,
  onBack,
}: {
  startList: RunnerDTO[];
  slots: FinishSlot[];
  onSlotsChange: (slots: FinishSlot[]) => void;
  isSaving: boolean;
  isError: boolean;
  onSave: () => void;
  onBack: () => void;
}) {
  const [reassigningSlotId, setReassigningSlotId] = useState<number | null>(
    null,
  );
  const [editingTimeId, setEditingTimeId] = useState<number | null>(null);
  const [editTimeValue, setEditTimeValue] = useState("");

  const assignedUuids = new Set(
    slots.filter((s) => s.runner !== null).map((s) => s.runner!.uuid),
  );

  const startListAvailable = startList.filter(
    (r) => !assignedUuids.has(r.uuid),
  );
  const startListExhausted = startListAvailable.length === 0;

  const { data: allRunners } = useQuery({
    ...QUERIES.runner.getAllRunners(),
    enabled: startListExhausted,
  });

  const availableRunners: RunnerDTO[] = startListExhausted
    ? (allRunners ?? []).filter((r) => !assignedUuids.has(r.uuid))
    : startListAvailable;

  function assignRunner(runner: RunnerDTO) {
    if (reassigningSlotId === null) return;
    onSlotsChange(
      slots.map((s) => (s.id === reassigningSlotId ? { ...s, runner } : s)),
    );
    setReassigningSlotId(null);
  }

  function unassign(slotId: number) {
    onSlotsChange(
      slots.map((s) => (s.id === slotId ? { ...s, runner: null } : s)),
    );
  }

  function removeSlot(slotId: number) {
    onSlotsChange(slots.filter((s) => s.id !== slotId));
  }

  function startEditTime(slot: FinishSlot) {
    setEditingTimeId(slot.id);
    setEditTimeValue(formatSecondsToTime(Math.round(slot.elapsedSeconds)));
  }

  function saveEditTime(slotId: number) {
    const secs = timeToSeconds(editTimeValue);
    if (secs > 0) {
      onSlotsChange(
        slots.map((s) =>
          s.id === slotId ? { ...s, elapsedSeconds: secs } : s,
        ),
      );
    }
    setEditingTimeId(null);
  }

  const unassignedCount = slots.filter((s) => s.runner === null).length;
  const assignedCount = slots.filter((s) => s.runner !== null).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{assignedCount}</span>{" "}
          av {slots.length} koblet
        </p>
        {unassignedCount > 0 && (
          <Badge
            variant="secondary"
            className="text-orange-600 bg-orange-100 dark:bg-orange-950/40"
          >
            {unassignedCount} ikke koblet
          </Badge>
        )}
      </div>

      <div className="space-y-2">
        {slots.map((slot, i) => (
          <div
            key={slot.id}
            className={`rounded-lg border p-3 flex items-center gap-3 ${
              slot.runner === null
                ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20"
                : "border-border bg-card"
            }`}
          >
            <span className="text-muted-foreground text-xs w-5 text-right tabular-nums shrink-0">
              {i + 1}.
            </span>

            {editingTimeId === slot.id ? (
              <div className="flex items-center gap-1.5 shrink-0">
                <Input
                  className="h-7 w-24 text-xs px-2 font-mono"
                  value={editTimeValue}
                  onChange={(e) => setEditTimeValue(e.target.value)}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEditTime(slot.id);
                    if (e.key === "Escape") setEditingTimeId(null);
                  }}
                />
                <button
                  type="button"
                  className="text-primary hover:text-primary/80"
                  onClick={() => saveEditTime(slot.id)}
                >
                  <CheckIcon className="size-3.5" />
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingTimeId(null)}
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="font-mono tabular-nums text-sm font-semibold w-20 shrink-0 text-left group flex items-center gap-1"
                onClick={() => startEditTime(slot)}
                title="Endre tid"
              >
                {formatSecondsToTime(Math.round(slot.elapsedSeconds))}
                <PencilIcon className="size-2.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            )}

            {slot.runner ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <CheckIcon className="size-3.5 text-green-500 shrink-0" />
                <span className="text-sm font-medium truncate">
                  {slot.runner.name}
                </span>
                <div className="ml-auto flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground p-1"
                    onClick={() => setReassigningSlotId(slot.id)}
                    title="Bytt løper"
                  >
                    <UserIcon className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-destructive p-1"
                    onClick={() => unassign(slot.id)}
                    title="Fjern kobling"
                  >
                    <XIcon className="size-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1">
                <XCircleIcon className="size-3.5 text-orange-500 shrink-0" />
                <button
                  type="button"
                  className="text-sm text-orange-600 dark:text-orange-400 hover:underline font-medium"
                  onClick={() => setReassigningSlotId(slot.id)}
                >
                  Koble løper
                </button>
                <button
                  type="button"
                  className="ml-auto text-muted-foreground hover:text-destructive"
                  onClick={() => removeSlot(slot.id)}
                  title="Slett rad"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {unassignedCount > 0 && (
        <p className="text-sm text-orange-600 dark:text-orange-400">
          {unassignedCount} rad{unassignedCount !== 1 ? "er" : ""} mangler
          løper. Du kan lagre uten å koble, men disse vil ikke bli registrert.
        </p>
      )}

      {isError && (
        <p className="text-sm text-destructive">Noe gikk galt. Prøv igjen.</p>
      )}

      <div className="flex justify-between gap-3 pt-2">
        <Button variant="outline" onClick={onBack}>
          Tilbake til tidtaking
        </Button>
        <Button disabled={assignedCount === 0 || isSaving} onClick={onSave}>
          {isSaving
            ? "Lagrer..."
            : `Lagre ${assignedCount} resultat${assignedCount !== 1 ? "er" : ""}`}
        </Button>
      </div>

      <Drawer
        open={reassigningSlotId !== null}
        onOpenChange={(open) => {
          if (!open) setReassigningSlotId(null);
        }}
      >
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Velg løper</DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 space-y-1 max-h-[60vh] overflow-y-auto">
            {startListExhausted && availableRunners.length > 0 && (
              <p className="text-xs text-muted-foreground italic px-1 pb-2">
                Alle på startlisten er koblet – viser alle løpere.
              </p>
            )}
            {availableRunners.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Ingen tilgjengelige løpere.
              </p>
            ) : (
              availableRunners.map((runner) => (
                <button
                  key={runner.uuid}
                  type="button"
                  className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-left hover:bg-muted transition-colors"
                  onClick={() => assignRunner(runner)}
                >
                  <span className="font-medium">{runner.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {runner.gender}
                  </Badge>
                </button>
              ))
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
