import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeftIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { CsvReviewTable } from "@/components/admin/CsvReviewTable.tsx";
import { CsvRaceSelector } from "@/components/admin/CsvRaceSelector.tsx";
import { CsvUploadStep } from "@/components/admin/CsvUploadStep.tsx";
import { Button } from "@/components/ui/button.tsx";
import { secondsToDuration } from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";
import type { CsvRow } from "@/components/admin/CsvReviewTable.tsx";

type Step = "race" | "upload" | "review";

export function ImportResultsFromFile() {
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const pastRaces = (races ?? []).filter(isPast);

  const [step, setStep] = useState<Step>("race");
  const [selectedRace, setSelectedRace] = useState<RaceDTO | null>(null);
  const [rows, setRows] = useState<CsvRow[]>([]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const raceUuid = selectedRace!.uuid!;
      const raceRunners = rows
        .filter((r) => r.resolvedRunner !== null)
        .map((r) => ({
          runner: r.resolvedRunner!,
          race: selectedRace!,
          resultTime: secondsToDuration(r.timeSeconds),
          hideTime: r.timeSeconds === 0,
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

  const unresolved = rows.filter((r) => r.resolvedRunner === null).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>

      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Registrer resultat fra fil
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Last opp en CSV-fil med løpernavn og tider.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-sm">
        {(["race", "upload", "review"] as Step[]).map((s, i) => {
          const labels: Record<Step, string> = {
            race: "Velg løp",
            upload: "Last opp fil",
            review: "Gjennomgå",
          };
          const done =
            (s === "race" && (step === "upload" || step === "review")) ||
            (s === "upload" && step === "review");
          const active = s === step;
          return (
            <span key={s} className="flex items-center gap-2">
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
                {labels[s]}
              </span>
              {i < 2 && (
                <span className="text-muted-foreground/40 mx-1">›</span>
              )}
            </span>
          );
        })}
      </div>

      {step === "race" && (
        <CsvRaceSelector
          races={pastRaces}
          selected={selectedRace}
          onSelect={setSelectedRace}
          onNext={() => setStep("upload")}
        />
      )}

      {step === "upload" && (
        <CsvUploadStep
          onParsed={(parsed) => {
            setRows(parsed);
            setStep("review");
          }}
          onBack={() => setStep("race")}
        />
      )}

      {step === "review" && selectedRace && (
        <div className="space-y-4">
          <CsvReviewTable rows={rows} onRowsChange={setRows} />

          {unresolved > 0 && (
            <p className="text-sm text-orange-600 dark:text-orange-400">
              {unresolved} rad{unresolved !== 1 ? "er" : ""} mangler løper – løs
              disse før du lagrer.
            </p>
          )}

          <div className="flex justify-between gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep("upload")}>
              Tilbake
            </Button>
            <Button
              disabled={
                unresolved > 0 || rows.length === 0 || saveMutation.isPending
              }
              onClick={() => saveMutation.mutate()}
            >
              {saveMutation.isPending
                ? "Lagrer..."
                : `Lagre ${rows.length} resultater`}
            </Button>
          </div>
          {saveMutation.isError && (
            <p className="text-sm text-destructive">
              Noe gikk galt. Prøv igjen.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
