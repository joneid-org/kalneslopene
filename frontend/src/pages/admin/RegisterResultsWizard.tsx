import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  LogOutIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { PublishStep } from "@/components/admin/registerResults/PublishStep.tsx";
import { RegisterRunnersStep } from "@/components/admin/registerResults/RegisterRunnersStep.tsx";
import { RegisterTimesStep } from "@/components/admin/registerResults/RegisterTimesStep.tsx";
import { ReviewStep } from "@/components/admin/registerResults/ReviewStep.tsx";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";

const STEP_OPTIONS = [
  { label: "1. Løpere", value: 1 },
  { label: "2. Tider", value: 2 },
  { label: "3. Lagre", value: 3 },
  { label: "4. Se over", value: 4 },
  { label: "5. Publiser", value: 5 },
];

export function RegisterResultsWizard() {
  const { uuid = "" } = useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: race } = useQuery(QUERIES.race.getRaceByUuid(uuid));
  const entriesQuery = useQuery({
    ...QUERIES.race.getAllRunnersInRace(uuid),
    staleTime: 0,
    gcTime: 0,
  });

  const [entries, setEntries] = useState<RaceRunnerDTO[]>([]);
  const [weather, setWeather] = useState("");
  const [step, setStep] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [busyRunnerUuid, setBusyRunnerUuid] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || entriesQuery.isPending || !race) return;
    setEntries(entriesQuery.data ?? []);
    setWeather(race.weather ?? "");
    setInitialized(true);
  }, [entriesQuery.isPending, entriesQuery.data, race, initialized]);

  const makeEntry = (
    runner: RunnerDTO,
    resultTime = "PT0S",
    hideTime = false,
  ): RaceRunnerDTO => ({
    runner,
    raceUuid: uuid,
    resultTime,
    hideTime,
    totalRaces: 0,
    seasonRaces: 0,
  });

  const invalidateRaceLists = () => {
    qc.invalidateQueries({ queryKey: ["race", "getAll"] });
    qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
  };

  const addExisting = async (runner: RunnerDTO) => {
    if (entries.some((e) => e.runner.uuid === runner.uuid)) return;
    setIsAdding(true);
    try {
      const [saved] = await MUTATIONS.race.addRunnersToRace(uuid, [
        makeEntry(runner),
      ]);
      setEntries((prev) => [...prev, saved]);
      invalidateRaceLists();
    } finally {
      setIsAdding(false);
    }
  };

  const addNew = async (name: string, gender: string) => {
    setIsAdding(true);
    try {
      const [created] = await MUTATIONS.runner.createRunners([
        { name, gender },
      ]);
      const [saved] = await MUTATIONS.race.addRunnersToRace(uuid, [
        makeEntry(created),
      ]);
      setEntries((prev) => [...prev, saved]);
      invalidateRaceLists();
    } finally {
      setIsAdding(false);
    }
  };

  const removeEntry = async (runnerUuid: string) => {
    setEntries((prev) => prev.filter((e) => e.runner.uuid !== runnerUuid));
    await MUTATIONS.race.removeRunnersFromRace(uuid, [runnerUuid]);
    invalidateRaceLists();
  };

  const updateResult = (
    runnerUuid: string,
    patch: { resultTime?: string; hideTime?: boolean },
  ) => {
    const current = entries.find((e) => e.runner.uuid === runnerUuid);
    if (!current) return;
    const updated = { ...current, ...patch };
    setEntries((prev) =>
      prev.map((e) => (e.runner.uuid === runnerUuid ? updated : e)),
    );
    MUTATIONS.race
      .updateRunnerInRace(uuid, runnerUuid, updated)
      .catch(() => {});
  };

  const persistRunner = (runner: RunnerDTO) => {
    setEntries((prev) =>
      prev.map((e) => (e.runner.uuid === runner.uuid ? { ...e, runner } : e)),
    );
    MUTATIONS.runner.updateRunner(runner.uuid, runner).catch(() => {});
    qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
  };

  const updateRunner = (
    runnerUuid: string,
    patch: { name?: string; gender?: string },
  ) => {
    const current = entries.find((e) => e.runner.uuid === runnerUuid);
    if (!current) return;
    persistRunner({ ...current.runner, ...patch });
  };

  const verifyRunner = async (runnerUuid: string) => {
    const current = entries.find((e) => e.runner.uuid === runnerUuid);
    if (!current) return;
    setBusyRunnerUuid(runnerUuid);
    try {
      const saved = await MUTATIONS.runner.updateRunner(runnerUuid, {
        ...current.runner,
        isVerified: true,
      });
      setEntries((prev) =>
        prev.map((e) =>
          e.runner.uuid === runnerUuid ? { ...e, runner: saved } : e,
        ),
      );
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
    } finally {
      setBusyRunnerUuid(null);
    }
  };

  const changeRunner = async (oldRunnerUuid: string, newRunner: RunnerDTO) => {
    const current = entries.find((e) => e.runner.uuid === oldRunnerUuid);
    if (!current || entries.some((e) => e.runner.uuid === newRunner.uuid))
      return;
    setBusyRunnerUuid(oldRunnerUuid);
    try {
      await MUTATIONS.race.removeRunnersFromRace(uuid, [oldRunnerUuid]);
      const [saved] = await MUTATIONS.race.addRunnersToRace(uuid, [
        makeEntry(newRunner, current.resultTime ?? undefined, current.hideTime),
      ]);
      setEntries((prev) =>
        prev.map((e) => (e.runner.uuid === oldRunnerUuid ? saved : e)),
      );
    } finally {
      setBusyRunnerUuid(null);
    }
  };

  const persistWeather = async () => {
    if (!race) return;
    await MUTATIONS.race.updateRace(uuid, {
      ...race,
      weather: weather.trim() || undefined,
    });
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      await persistWeather();
      return MUTATIONS.race.publishResults(uuid);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      qc.invalidateQueries({ queryKey: ["race", uuid, "runnersInRace"] });
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
      navigate("/admin/results");
    },
  });

  if (entriesQuery.isPending || !initialized) {
    return (
      <div className="page-content mx-auto flex max-w-2xl justify-center py-20">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const raceLabel = race ? formatDDMonth(race.raceDate) : "";

  return (
    <div className="page-content mx-auto max-w-2xl space-y-6">
      <Button
        variant="ghost"
        className="-ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/admin/results")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrer resultater
        </h1>
        {raceLabel && <p className="text-muted-foreground">{raceLabel}</p>}
      </div>

      <div className="overflow-x-auto">
        <SegmentedControl
          options={STEP_OPTIONS}
          value={step}
          onChange={setStep}
        />
      </div>

      {step === 1 && (
        <RegisterRunnersStep
          entries={entries}
          onAddExisting={addExisting}
          onAddNew={addNew}
          onRemove={removeEntry}
          isAdding={isAdding}
        />
      )}
      {step === 2 && (
        <RegisterTimesStep
          entries={entries}
          onAddExisting={addExisting}
          onAddNew={addNew}
          onRemove={removeEntry}
          onUpdateResult={updateResult}
          isAdding={isAdding}
        />
      )}
      {step === 3 && <SaveStep onLeave={() => navigate("/admin/results")} />}
      {step === 4 && (
        <ReviewStep
          entries={entries}
          weather={weather}
          onWeatherChange={setWeather}
          onWeatherBlur={persistWeather}
          onUpdateResult={updateResult}
          onUpdateRunner={updateRunner}
          onRemove={removeEntry}
          onVerifyRunner={verifyRunner}
          onChangeRunner={changeRunner}
          busyRunnerUuid={busyRunnerUuid}
        />
      )}
      {step === 5 && (
        <PublishStep
          entries={entries}
          weather={weather}
          onPublish={() => publishMutation.mutate()}
          isPublishing={publishMutation.isPending}
        />
      )}

      <div className="flex items-center justify-between border-t pt-4">
        <Button
          variant="outline"
          className="gap-1.5"
          disabled={step === 1}
          onClick={() => setStep(step - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Forrige
        </Button>

        <Button
          className="gap-1.5"
          disabled={step === 5}
          onClick={() => setStep(step + 1)}
        >
          Neste
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function SaveStep({ onLeave }: { onLeave: () => void }) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Lagre og fortsett senere</h2>
        <p className="text-sm text-muted-foreground">
          Alt lagres fortløpende på serveren. Du kan trygt lukke siden og logge
          inn igjen senere – ingenting blir borte. Resultatene publiseres ikke
          før du gjør det i siste steg.
        </p>
      </div>

      <Button variant="outline" className="w-full gap-1.5" onClick={onLeave}>
        <LogOutIcon className="size-4" />
        Lukk
      </Button>
    </div>
  );
}
