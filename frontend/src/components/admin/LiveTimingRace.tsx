import { useQuery } from "@tanstack/react-query";
import {
  CheckIcon,
  FlagIcon,
  StopCircleIcon,
  UserIcon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import type { FinishSlot } from "@/pages/admin/LiveTiming.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer.tsx";
import { formatSecondsToTime } from "@/lib/timeUtils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

type TimingState = "idle" | "running" | "stopped";

export function LiveTimingRace({
  startList,
  slots,
  onSlotsChange,
  onStop,
}: {
  startList: RunnerDTO[];
  slots: FinishSlot[];
  onSlotsChange: (slots: FinishSlot[]) => void;
  onStop: () => void;
}) {
  const [state, setState] = useState<TimingState>("idle");
  const [display, setDisplay] = useState(0); // seconds shown on clock
  const [assigningSlotId, setAssigningSlotId] = useState<number | null>(null);
  const [confirmStop, setConfirmStop] = useState(false);

  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const nextIdRef = useRef(0);

  // Tick the display every 100ms via rAF
  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setDisplay(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    }
  }, []);

  function handleStart() {
    startTimeRef.current = Date.now();
    setState("running");
    rafRef.current = requestAnimationFrame(tick);
  }

  function handleRegister() {
    if (startTimeRef.current === null) return;
    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const newSlot: FinishSlot = {
      id: nextIdRef.current++,
      elapsedSeconds: elapsed,
      runner: null,
    };
    onSlotsChange([...slots, newSlot]);
  }

  function handleStop() {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    setState("stopped");
    setConfirmStop(false);
  }

  function handleAssign(runner: RunnerDTO) {
    if (assigningSlotId === null) return;
    onSlotsChange(
      slots.map((s) => (s.id === assigningSlotId ? { ...s, runner } : s)),
    );
    setAssigningSlotId(null);
  }

  function handleUnassign(slotId: number) {
    onSlotsChange(
      slots.map((s) => (s.id === slotId ? { ...s, runner: null } : s)),
    );
  }

  function handleRemoveSlot(slotId: number) {
    onSlotsChange(slots.filter((s) => s.id !== slotId));
  }

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const assignedRunnerUuids = new Set(
    slots.filter((s) => s.runner !== null).map((s) => s.runner!.uuid),
  );

  const startListAvailable = startList.filter(
    (r) => !assignedRunnerUuids.has(r.uuid),
  );

  const startListExhausted = startListAvailable.length === 0;

  const { data: allRunners } = useQuery({
    ...QUERIES.runner.getAllRunners(),
    enabled: startListExhausted,
  });

  const availableRunners: RunnerDTO[] = startListExhausted
    ? (allRunners ?? []).filter((r) => !assignedRunnerUuids.has(r.uuid))
    : startListAvailable;

  const unassigned = slots.filter((s) => s.runner === null).length;

  // Format elapsed as mm:ss.t (tenths)
  function formatLive(secs: number): string {
    const total = Math.floor(secs);
    const tenths = Math.floor((secs % 1) * 10);
    const mm = Math.floor(total / 60);
    const ss = total % 60;
    return `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}.${tenths}`;
  }

  return (
    <div className="space-y-4">
      {/* Clock */}
      <div className="rounded-xl border bg-card p-6 flex flex-col items-center gap-4">
        <div
          className={`font-mono text-5xl font-bold tabular-nums tracking-tight transition-colors ${
            state === "running"
              ? "text-primary"
              : state === "stopped"
                ? "text-muted-foreground"
                : "text-muted-foreground/40"
          }`}
        >
          {formatLive(display)}
        </div>

        {state === "idle" && (
          <Button
            size="lg"
            className="w-full text-lg h-14 gap-2 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleStart}
          >
            <FlagIcon className="size-5" />
            Start
          </Button>
        )}

        {state === "running" && (
          <div className="flex gap-3 w-full">
            <Button
              size="lg"
              className="flex-1 text-base h-14 gap-2"
              onClick={handleRegister}
            >
              <FlagIcon className="size-5" />
              Registrer
            </Button>
            <Button
              size="lg"
              variant="destructive"
              className="h-14 px-5 gap-2"
              onClick={() => setConfirmStop(true)}
            >
              <StopCircleIcon className="size-5" />
              Stopp
            </Button>
          </div>
        )}

        {state === "stopped" && (
          <div className="flex flex-col items-center gap-2 w-full">
            <p className="text-sm text-muted-foreground">Tidtaking stoppet</p>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setState("running");
                  startTimeRef.current = Date.now() - display * 1000;
                  rafRef.current = requestAnimationFrame(tick);
                }}
              >
                Fortsett
              </Button>
              <Button
                className="flex-1"
                disabled={slots.length === 0}
                onClick={onStop}
              >
                Gå til gjennomgang
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Confirm stop dialog */}
      {confirmStop && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 space-y-3">
          <p className="text-sm font-medium">Stopp tidtaking?</p>
          <p className="text-xs text-muted-foreground">
            Du kan fortsette etterpå hvis nødvendig.
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="flex-1"
              onClick={() => setConfirmStop(false)}
            >
              Avbryt
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="flex-1"
              onClick={handleStop}
            >
              Stopp
            </Button>
          </div>
        </div>
      )}

      {/* Stats row */}
      {slots.length > 0 && (
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {slots.length}
            </span>{" "}
            registrert
          </span>
          {unassigned > 0 && (
            <span className="text-orange-500 font-medium">
              {unassigned} ikke koblet
            </span>
          )}
          <span>
            <span className="font-semibold text-foreground">
              {availableRunners.length}
            </span>{" "}
            gjenstår på startliste
          </span>
        </div>
      )}

      {/* Finish slots list */}
      {slots.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Målganger ({slots.length})
          </p>
          <div className="space-y-2">
            {[...slots].reverse().map((slot, revIdx) => {
              const pos = slots.length - revIdx;
              return (
                <div
                  key={slot.id}
                  className={`rounded-lg border p-3 flex items-center gap-3 ${
                    slot.runner === null
                      ? "border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/20"
                      : "border-border bg-card"
                  }`}
                >
                  <span className="text-muted-foreground text-xs w-5 text-right tabular-nums shrink-0">
                    {pos}.
                  </span>
                  <span className="font-mono tabular-nums text-sm font-semibold w-20 shrink-0">
                    {formatSecondsToTime(Math.round(slot.elapsedSeconds))}
                  </span>

                  {slot.runner ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <CheckIcon className="size-3.5 text-green-500 shrink-0" />
                      <span className="text-sm font-medium truncate">
                        {slot.runner.name}
                      </span>
                      <button
                        type="button"
                        className="ml-auto text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleUnassign(slot.id)}
                        title="Fjern kobling"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <button
                        type="button"
                        className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 font-medium"
                        onClick={() => setAssigningSlotId(slot.id)}
                      >
                        <UserIcon className="size-3.5" />
                        Koble løper
                      </button>
                      <button
                        type="button"
                        className="ml-auto text-muted-foreground hover:text-destructive shrink-0"
                        onClick={() => handleRemoveSlot(slot.id)}
                        title="Slett"
                      >
                        <XIcon className="size-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Runner picker drawer */}
      <Drawer
        open={assigningSlotId !== null}
        onOpenChange={(open) => {
          if (!open) setAssigningSlotId(null);
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
            {availableRunners.length === 0 && (
              <p className="text-sm text-muted-foreground italic text-center py-4">
                Ingen tilgjengelige løpere.
              </p>
            )}
            {availableRunners.map((runner) => (
              <button
                key={runner.uuid}
                type="button"
                className="w-full flex items-center justify-between px-3 py-3 rounded-lg text-left hover:bg-muted transition-colors"
                onClick={() => handleAssign(runner)}
              >
                <span className="font-medium">{runner.name}</span>
                <Badge variant="outline" className="text-xs">
                  {runner.gender}
                </Badge>
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
