import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  Loader2Icon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import {
  formToWeather,
  type WeatherForm,
  weatherToForm,
} from "@/components/admin/registerResults/helpers.ts";
import { PublishStep } from "@/components/admin/registerResults/PublishStep.tsx";
import { RegisterRunnersStep } from "@/components/admin/registerResults/RegisterRunnersStep.tsx";
import { RegisterTimesStep } from "@/components/admin/registerResults/RegisterTimesStep.tsx";
import { ReviewStep } from "@/components/admin/registerResults/ReviewStep.tsx";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, RunnerDTO } from "@/model/DTO.ts";

const EMPTY_WEATHER: WeatherForm = {
  symbol: "",
  temperature: "",
  windSpeed: "",
  precipitation: "",
};

const BASE_STEPS = [
  { label: "1. Løpere", value: 1 },
  { label: "2. Tider", value: 2 },
  { label: "3. Se over", value: 3 },
];
const PUBLISH_STEP = { label: "4. Publiser", value: 4 };

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
  const [weather, setWeather] = useState<WeatherForm>(EMPTY_WEATHER);
  const [courseCondition, setCourseCondition] = useState("");
  const [step, setStep] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [busyRunnerUuid, setBusyRunnerUuid] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || entriesQuery.isPending || !race) return;
    setEntries(entriesQuery.data ?? []);
    setWeather(weatherToForm(race.weather));
    setCourseCondition(race.courseCondition ?? "");
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
      const [saved] = await QUERIES.race
        .addRunnersToRace(uuid, [makeEntry(runner)])
        .queryFn();
      setEntries((prev) => [...prev, saved]);
      invalidateRaceLists();
    } finally {
      setIsAdding(false);
    }
  };

  const addNew = async (name: string, gender: string) => {
    setIsAdding(true);
    try {
      const [created] = await QUERIES.runner
        .createRunners([{ name, gender }])
        .queryFn();
      const [saved] = await QUERIES.race
        .addRunnersToRace(uuid, [makeEntry(created)])
        .queryFn();
      setEntries((prev) => [...prev, saved]);
      invalidateRaceLists();
    } finally {
      setIsAdding(false);
    }
  };

  const removeEntry = async (runnerUuid: string) => {
    setEntries((prev) => prev.filter((e) => e.runner.uuid !== runnerUuid));
    await QUERIES.race.removeRunnersFromRace(uuid, [runnerUuid]).queryFn();
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
    QUERIES.race
      .updateRunnerInRace(uuid, runnerUuid, updated)
      .queryFn()
      .catch(() => {});
  };

  const persistRunner = (runner: RunnerDTO) => {
    setEntries((prev) =>
      prev.map((e) => (e.runner.uuid === runner.uuid ? { ...e, runner } : e)),
    );
    QUERIES.runner
      .updateRunner(runner.uuid, runner)
      .queryFn()
      .catch(() => {});
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
      const saved = await QUERIES.runner
        .updateRunner(runnerUuid, { ...current.runner, isVerified: true })
        .queryFn();
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
      await QUERIES.race.removeRunnersFromRace(uuid, [oldRunnerUuid]).queryFn();
      const [saved] = await QUERIES.race
        .addRunnersToRace(uuid, [
          makeEntry(
            newRunner,
            current.resultTime ?? undefined,
            current.hideTime,
          ),
        ])
        .queryFn();
      setEntries((prev) =>
        prev.map((e) => (e.runner.uuid === oldRunnerUuid ? saved : e)),
      );
    } finally {
      setBusyRunnerUuid(null);
    }
  };

  const persistRace = async (form: WeatherForm, condition: string) => {
    if (!race) return;
    await QUERIES.race
      .updateRace(uuid, {
        ...race,
        weather: formToWeather(form),
        courseCondition: condition.trim() || undefined,
      })
      .queryFn();
  };

  const publishMutation = useMutation({
    mutationFn: async () => {
      await persistRace(weather, courseCondition);
      return QUERIES.race.publishResults(uuid).queryFn();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      qc.invalidateQueries({ queryKey: ["race", "getById", uuid] });
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
  const isPublished = race?.isPublished ?? false;
  const stepOptions = isPublished ? BASE_STEPS : [...BASE_STEPS, PUBLISH_STEP];
  const lastStep = stepOptions.length;

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

      {isPublished ? (
        <div className="flex items-start gap-2 rounded-md border border-green-300 bg-green-50 p-3 text-sm dark:border-green-900 dark:bg-green-950/30">
          <CheckCircle2Icon className="size-4 shrink-0 text-green-600" />
          <span>
            Publisert – endringer lagres og vises på nettsiden umiddelbart.
          </span>
        </div>
      ) : (
        <div className="flex items-start gap-2 rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground">
          <CircleDashedIcon className="size-4 shrink-0" />
          <span>
            Kladd – endringene vises først når du publiserer i siste steg.
          </span>
        </div>
      )}

      <div className="overflow-x-auto">
        <SegmentedControl
          options={stepOptions}
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
      {step === 3 && (
        <ReviewStep
          entries={entries}
          weather={weather}
          onWeatherChange={setWeather}
          onWeatherPersist={(form) => persistRace(form, courseCondition)}
          courseCondition={courseCondition}
          onCourseConditionChange={setCourseCondition}
          onCourseConditionPersist={(value) => persistRace(weather, value)}
          onUpdateResult={updateResult}
          onUpdateRunner={updateRunner}
          onRemove={removeEntry}
          onVerifyRunner={verifyRunner}
          onChangeRunner={changeRunner}
          busyRunnerUuid={busyRunnerUuid}
          onClose={isPublished ? () => navigate("/admin/results") : undefined}
        />
      )}
      {!isPublished && step === 4 && (
        <PublishStep
          entries={entries}
          weather={weather}
          courseCondition={courseCondition}
          onPublish={() => publishMutation.mutate()}
          isPublishing={publishMutation.isPending}
        />
      )}

      <div className="flex items-center justify-between border-t pt-4">
        {step > 1 && (
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => setStep(step - 1)}
          >
            <ChevronLeftIcon className="size-4" />
            Forrige
          </Button>
        )}

        {step < lastStep && (
          <Button className="ml-auto gap-1.5" onClick={() => setStep(step + 1)}>
            Neste
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
