import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleDashedIcon,
  Loader2Icon,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import {
  formToRace,
  type RaceForm,
  type RacePatch,
  type RaceValues,
  raceFormSchema,
  raceToForm,
} from "@/components/admin/registerResults/helpers.ts";
import { PublishStep } from "@/components/admin/registerResults/PublishStep.tsx";
import { RegisterRunnersStep } from "@/components/admin/registerResults/RegisterRunnersStep.tsx";
import { RegisterTimesStep } from "@/components/admin/registerResults/RegisterTimesStep.tsx";
import { ReviewStep } from "@/components/admin/registerResults/ReviewStep.tsx";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import type {
  RaceDTO,
  RaceRunnerDTO,
  RunnerDTO,
  RunnerInput,
} from "@/model/DTO.ts";

const BASE_STEPS = [
  { label: "1. Løpere", value: 1 },
  { label: "2. Tider", value: 2 },
  { label: "3. Se over", value: 3 },
];
const PUBLISH_STEP = { label: "4. Publiser", value: 4 };

export function RegisterResultsWizard() {
  const { uuid = "" } = useParams();
  const { data: race } = useQuery(QUERIES.race.getRaceByUuid(uuid));
  // The wizard owns the entries in local state after the first load; never
  // refetch behind its back, but refetch from scratch on re-entry (gcTime: 0).
  const { data: initialEntries } = useQuery({
    ...QUERIES.race.getAllRunnersInRace(uuid),
    staleTime: 0,
    gcTime: 0,
    refetchOnWindowFocus: false,
  });

  if (!race || !initialEntries) {
    return (
      <div className="page-content mx-auto flex max-w-2xl justify-center py-20">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Wizard key={uuid} race={race} initialEntries={initialEntries} />;
}

function Wizard({
  race,
  initialEntries,
}: {
  race: RaceDTO;
  initialEntries: RaceRunnerDTO[];
}) {
  const { uuid } = race;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [entries, setEntries] = useState(initialEntries);
  const [step, setStep] = useState(1);
  const form = useForm<RaceForm, unknown, RaceValues>({
    defaultValues: raceToForm(race),
    resolver: standardSchemaResolver(raceFormSchema),
    mode: "onBlur",
  });

  /** Entries, times and publishing also feed the runner lists and the statistics pages. */
  const invalidateResults = () => {
    qc.invalidateQueries({ queryKey: ["race"], refetchType: "none" });
    qc.invalidateQueries({ queryKey: ["runner"], refetchType: "none" });
    qc.invalidateQueries({ queryKey: ["statistics"], refetchType: "none" });
  };

  const patchEntry = (runnerUuid: string, patch: Partial<RaceRunnerDTO>) =>
    setEntries((prev) =>
      prev.map((e) => (e.runner.uuid === runnerUuid ? { ...e, ...patch } : e)),
    );

  const makeEntry = (
    runner: RunnerDTO,
    resultTime = "PT0S",
    hideTime = false,
  ): RaceRunnerDTO => ({
    runner,
    raceInfo: { uuid, raceDate: race.raceDate },
    resultTime,
    hideTime,
    totalRaces: 0,
    seasonRaces: 0,
  });

  const addMutation = useMutation({
    mutationFn: async (input: RunnerDTO | RunnerInput) => {
      const runner =
        "uuid" in input
          ? input
          : (await MUTATIONS.runner.createRunners([input]))[0];
      const [saved] = await MUTATIONS.race.addRunnersToRace(uuid, [
        makeEntry(runner),
      ]);
      return saved;
    },
    onSuccess: (saved) => {
      setEntries((prev) => [...prev, saved]);
      invalidateResults();
    },
  });

  const removeMutation = useMutation({
    mutationFn: (runnerUuid: string) =>
      MUTATIONS.race.removeRunnersFromRace(uuid, [runnerUuid]),
    onMutate: (runnerUuid) =>
      setEntries((prev) => prev.filter((e) => e.runner.uuid !== runnerUuid)),
    onSuccess: invalidateResults,
  });

  const updateResultMutation = useMutation({
    mutationFn: (entry: RaceRunnerDTO) =>
      MUTATIONS.race.updateRunnerInRace(uuid, entry.runner.uuid, entry),
    onMutate: (entry) => patchEntry(entry.runner.uuid, entry),
    onSuccess: invalidateResults,
  });

  const updateRunnerMutation = useMutation({
    mutationFn: (runner: RunnerDTO) =>
      MUTATIONS.runner.updateRunner(runner.uuid, runner),
    onMutate: (runner) => patchEntry(runner.uuid, { runner }),
    onSuccess: invalidateResults,
  });

  const verifyMutation = useMutation({
    mutationFn: (runner: RunnerDTO) =>
      MUTATIONS.runner.updateRunner(runner.uuid, {
        ...runner,
        isVerified: true,
      }),
    onSuccess: (saved) => {
      patchEntry(saved.uuid, { runner: saved });
      invalidateResults();
    },
  });

  const changeMutation = useMutation({
    mutationFn: async ({
      entry,
      runner,
    }: {
      entry: RaceRunnerDTO;
      runner: RunnerDTO;
    }) => {
      await MUTATIONS.race.removeRunnersFromRace(uuid, [entry.runner.uuid]);
      const [saved] = await MUTATIONS.race.addRunnersToRace(uuid, [
        makeEntry(runner, entry.resultTime ?? undefined, entry.hideTime),
      ]);
      return saved;
    },
    onSuccess: (saved, { entry }) => {
      patchEntry(entry.runner.uuid, saved);
      invalidateResults();
    },
  });

  const busyRunnerUuid = verifyMutation.isPending
    ? verifyMutation.variables.uuid
    : changeMutation.isPending
      ? changeMutation.variables.entry.runner.uuid
      : null;

  const updateRaceMutation = useMutation({
    mutationFn: (patch: RacePatch) =>
      MUTATIONS.race.updateRace(uuid, { raceDate: race.raceDate, ...patch }),
    onSuccess: (updated) => {
      qc.setQueryData<RaceDTO>(
        QUERIES.race.getRaceByUuid(uuid).queryKey,
        updated,
      );
      invalidateResults();
    },
  });

  const publishMutation = useMutation({
    mutationFn: async (patch: RacePatch) => {
      await updateRaceMutation.mutateAsync(patch);
      return MUTATIONS.race.publishResults(uuid);
    },
    onSuccess: () => {
      invalidateResults();
      navigate("/admin/resultater");
    },
  });

  const persistRace = () => {
    const patch = formToRace(form.getValues());
    if (patch) updateRaceMutation.mutate(patch);
  };

  const racePatch = formToRace(form.getValues());

  const isPublished = race.isPublished;
  const stepOptions = isPublished ? BASE_STEPS : [...BASE_STEPS, PUBLISH_STEP];

  return (
    <div className="page-content mx-auto max-w-2xl space-y-6">
      <Button
        variant="ghost"
        className="-ml-2 gap-1.5 text-muted-foreground"
        onClick={() => navigate("/admin/resultater")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Registrer resultater
        </h1>
        <p className="text-muted-foreground">{formatDDMonth(race.raceDate)}</p>
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
          onAdd={addMutation.mutate}
          onRemove={removeMutation.mutate}
          isAdding={addMutation.isPending}
        />
      )}
      {step === 2 && (
        <RegisterTimesStep
          entries={entries}
          onAdd={addMutation.mutate}
          onRemove={removeMutation.mutate}
          onUpdateResult={updateResultMutation.mutate}
          isAdding={addMutation.isPending}
        />
      )}
      {step === 3 && (
        <ReviewStep
          entries={entries}
          form={form}
          onPersistRace={persistRace}
          onUpdateResult={updateResultMutation.mutate}
          onUpdateRunner={(entry, patch) =>
            updateRunnerMutation.mutate({ ...entry.runner, ...patch })
          }
          onRemove={removeMutation.mutate}
          onVerifyRunner={verifyMutation.mutate}
          onChangeRunner={(entry, runner) =>
            changeMutation.mutate({ entry, runner })
          }
          busyRunnerUuid={busyRunnerUuid}
          onClose={
            isPublished ? () => navigate("/admin/resultater") : undefined
          }
        />
      )}
      {!isPublished && step === 4 && (
        <PublishStep
          entries={entries}
          race={racePatch}
          onPublish={() => racePatch && publishMutation.mutate(racePatch)}
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

        {step < stepOptions.length && (
          <Button className="ml-auto gap-1.5" onClick={() => setStep(step + 1)}>
            Neste
            <ChevronRightIcon className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
