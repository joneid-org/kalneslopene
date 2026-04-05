import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { LiveTimingRace } from "@/components/admin/LiveTimingRace.tsx";
import { LiveTimingReview } from "@/components/admin/LiveTimingReview.tsx";
import { LiveTimingSetup } from "@/components/admin/LiveTimingSetup.tsx";
import { Button } from "@/components/ui/button.tsx";
import { secondsToDuration, raceDateToSortKey } from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO, RunnerDTO } from "@/model/DTO.ts";

export type FinishSlot = {
  id: number;
  elapsedSeconds: number;
  runner: RunnerDTO | null;
};

type Phase = "setup" | "racing" | "review";

export function LiveTiming() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const allRaces = races ?? [];

  // Most recent past race (last run)
  const lastRace =
    [...allRaces]
      .filter(isPast)
      .sort((a, b) =>
        raceDateToSortKey(b.raceDate).localeCompare(
          raceDateToSortKey(a.raceDate),
        ),
      )[0] ?? null;

  // Next upcoming race (closest in the future)
  const nextRace =
    [...allRaces]
      .filter((r) => !isPast(r))
      .sort((a, b) =>
        raceDateToSortKey(a.raceDate).localeCompare(
          raceDateToSortKey(b.raceDate),
        ),
      )[0] ?? null;

  const eligibleRaces: RaceDTO[] = [nextRace, lastRace].filter(
    (r): r is RaceDTO => r !== null,
  );

  const [phase, setPhase] = useState<Phase>("setup");
  const [selectedRace, setSelectedRace] = useState<RaceDTO | null>(null);
  const [startList, setStartList] = useState<RunnerDTO[]>([]);
  const [slots, setSlots] = useState<FinishSlot[]>([]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const raceUuid = selectedRace!.uuid!;
      const raceRunners = slots
        .filter((s) => s.runner !== null)
        .map((s) => ({
          runner: s.runner!,
          race: selectedRace!,
          resultTime: secondsToDuration(s.elapsedSeconds),
          hideTime: false,
        }));
      await QUERIES.race.addRunnersToRace(raceUuid, raceRunners).queryFn();
    },
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["race", selectedRace!.uuid, "runnersInRace"],
      });
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      navigate("/admin/results");
    },
  });

  const stepLabels: Record<Phase, string> = {
    setup: "Forberedelse",
    racing: "Tidtaking",
    review: "Gjennomgå",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() =>
          phase === "setup" ? navigate("/admin") : setPhase("setup")
        }
      >
        <ChevronLeftIcon className="size-4" />
        {phase === "setup" ? "Tilbake" : "Til forberedelse"}
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">Live tidtaking</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {stepLabels[phase]}
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(["setup", "racing", "review"] as Phase[]).map((p, i) => {
          const done =
            (p === "setup" && (phase === "racing" || phase === "review")) ||
            (p === "racing" && phase === "review");
          const active = p === phase;
          return (
            <span key={p} className="flex items-center gap-2">
              <span
                className={`flex items-center justify-center rounded-full size-6 text-xs font-semibold border ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : done
                      ? "bg-primary/20 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={active ? "font-medium" : "text-muted-foreground"}
              >
                {stepLabels[p]}
              </span>
              {i < 2 && (
                <span className="text-muted-foreground/40 mx-1">›</span>
              )}
            </span>
          );
        })}
      </div>

      {phase === "setup" && (
        <LiveTimingSetup
          races={eligibleRaces}
          selectedRace={selectedRace}
          startList={startList}
          onSelectRace={setSelectedRace}
          onStartListChange={setStartList}
          onStart={() => {
            setSlots([]);
            setPhase("racing");
          }}
        />
      )}

      {phase === "racing" && (
        <LiveTimingRace
          startList={startList}
          slots={slots}
          onSlotsChange={setSlots}
          onStop={() => setPhase("review")}
        />
      )}

      {phase === "review" && selectedRace && (
        <LiveTimingReview
          race={selectedRace}
          startList={startList}
          slots={slots}
          onSlotsChange={setSlots}
          isSaving={saveMutation.isPending}
          isError={saveMutation.isError}
          onSave={() => saveMutation.mutate()}
          onBack={() => setPhase("racing")}
        />
      )}
    </div>
  );
}
