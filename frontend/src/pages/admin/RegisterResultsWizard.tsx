import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  LogOutIcon,
  SaveIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { PublishStep } from "@/components/admin/registerResults/PublishStep.tsx";
import { RegisterRunnersStep } from "@/components/admin/registerResults/RegisterRunnersStep.tsx";
import { RegisterTimesStep } from "@/components/admin/registerResults/RegisterTimesStep.tsx";
import { ReviewStep } from "@/components/admin/registerResults/ReviewStep.tsx";
import { SegmentedControl } from "@/components/SegmentedControl.tsx";
import { Button } from "@/components/ui/button.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import type { DraftEntry, ResultDraftInput, RunnerInput } from "@/model/DTO.ts";

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
  const draftQuery = useQuery({
    ...QUERIES.resultDraft.getDraft(uuid),
    staleTime: 0,
    gcTime: 0,
  });

  const [entries, setEntries] = useState<DraftEntry[]>([]);
  const [weather, setWeather] = useState("");
  const [step, setStep] = useState(1);
  const [savingClientId, setSavingClientId] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized || draftQuery.isPending) return;
    const draft = draftQuery.data;
    if (draft) {
      setEntries(draft.entries);
      setWeather(draft.weather ?? "");
      setStep(draft.currentStep || 1);
    } else if (race?.weather) {
      setWeather(race.weather);
    }
    setInitialized(true);
  }, [draftQuery.isPending, draftQuery.data, race, initialized]);

  const buildDraft = (
    nextStep: number,
    nextEntries: DraftEntry[] = entries,
  ): ResultDraftInput => ({
    raceUuid: uuid,
    weather: weather.trim() || undefined,
    entries: nextEntries,
    currentStep: nextStep,
  });

  const saveMutation = useMutation({
    mutationFn: (draft: ResultDraftInput) =>
      QUERIES.resultDraft.saveDraft(uuid, draft).queryFn(),
    onSuccess: (saved) => {
      qc.setQueryData(QUERIES.resultDraft.getDraft(uuid).queryKey, saved);
    },
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      await saveMutation.mutateAsync(buildDraft(step));
      return QUERIES.resultDraft.publishDraft(uuid).queryFn();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      qc.invalidateQueries({ queryKey: ["race", uuid, "runnersInRace"] });
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
      navigate("/admin/results");
    },
  });

  const goToStep = (next: number) => {
    setStep(next);
    saveMutation.mutate(buildDraft(next));
  };

  const addEntry = (entry: DraftEntry) =>
    setEntries((prev) => [...prev, entry]);
  const removeEntry = (clientId: string) =>
    setEntries((prev) => prev.filter((e) => e.clientId !== clientId));
  const updateEntry = (clientId: string, patch: Partial<DraftEntry>) =>
    setEntries((prev) =>
      prev.map((e) => (e.clientId === clientId ? { ...e, ...patch } : e)),
    );

  const saveRunnerToDb = async (entry: DraftEntry) => {
    setSavingClientId(entry.clientId);
    try {
      const [created] = await QUERIES.runner
        .createRunners([
          { name: entry.name, gender: entry.gender } as RunnerInput,
        ])
        .queryFn();
      const updated = entries.map((e) =>
        e.clientId === entry.clientId ? { ...e, runnerUuid: created.uuid } : e,
      );
      setEntries(updated);
      await saveMutation.mutateAsync(buildDraft(step, updated));
      qc.invalidateQueries({ queryKey: ["runner", "getAll"] });
    } finally {
      setSavingClientId(null);
    }
  };

  if (draftQuery.isPending || !initialized) {
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
          onChange={goToStep}
        />
      </div>

      {step === 1 && (
        <RegisterRunnersStep
          entries={entries}
          onAdd={addEntry}
          onRemove={removeEntry}
        />
      )}
      {step === 2 && (
        <RegisterTimesStep
          entries={entries}
          onAdd={addEntry}
          onRemove={removeEntry}
          onUpdate={updateEntry}
        />
      )}
      {step === 3 && (
        <SaveDraftStep
          isSaving={saveMutation.isPending}
          isSaved={saveMutation.isSuccess}
          onSave={() => saveMutation.mutate(buildDraft(step))}
          onLeave={() =>
            saveMutation.mutate(buildDraft(step), {
              onSuccess: () => navigate("/admin/results"),
            })
          }
        />
      )}
      {step === 4 && (
        <ReviewStep
          entries={entries}
          weather={weather}
          onWeatherChange={setWeather}
          onUpdate={updateEntry}
          onRemove={removeEntry}
          onSaveRunnerToDb={saveRunnerToDb}
          savingClientId={savingClientId}
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
          onClick={() => goToStep(step - 1)}
        >
          <ChevronLeftIcon className="size-4" />
          Forrige
        </Button>

        <Button
          variant="ghost"
          className="gap-1.5 text-muted-foreground"
          disabled={saveMutation.isPending}
          onClick={() => saveMutation.mutate(buildDraft(step))}
        >
          {saveMutation.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : saveMutation.isSuccess ? (
            <CheckIcon className="size-4" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          Lagre utkast
        </Button>

        <Button
          className="gap-1.5"
          disabled={step === 5}
          onClick={() => goToStep(step + 1)}
        >
          Neste
          <ChevronRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function SaveDraftStep({
  isSaving,
  isSaved,
  onSave,
  onLeave,
}: {
  isSaving: boolean;
  isSaved: boolean;
  onSave: () => void;
  onLeave: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Lagre og fortsett senere</h2>
        <p className="text-sm text-muted-foreground">
          Arbeidet ditt lagres på serveren. Du kan trygt lukke siden og logge
          inn igjen senere – ingenting blir borte. Resultatene publiseres ikke
          før du gjør det i siste steg.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1 gap-1.5" disabled={isSaving} onClick={onSave}>
          {isSaving ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : isSaved ? (
            <CheckIcon className="size-4" />
          ) : (
            <SaveIcon className="size-4" />
          )}
          Lagre utkast
        </Button>
        <Button
          variant="outline"
          className="flex-1 gap-1.5"
          disabled={isSaving}
          onClick={onLeave}
        >
          <LogOutIcon className="size-4" />
          Lagre og lukk
        </Button>
      </div>
    </div>
  );
}
