/** biome-ignore-all lint/a11y/useKeyWithClickEvents: fordi. */
import { useQuery } from "@tanstack/react-query";
import { UploadIcon } from "lucide-react";
import { useRef, useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import type { CsvRow } from "@/components/admin/CsvReviewTable.tsx";
import { Button } from "@/components/ui/button.tsx";
import { timeToSeconds } from "@/lib/timeUtils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

function findBestMatch(
  csvName: string,
  runners: RunnerDTO[],
): RunnerDTO | null {
  const needle = normalizeName(csvName);
  return runners.find((r) => normalizeName(r.name) === needle) ?? null;
}

function parseCsv(text: string): { name: string; time: string }[] {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines
    .map((line) => {
      const parts = line
        .split(/[;,\t]/)
        .map((p) => p.trim().replace(/^"|"$/g, ""));
      if (parts.length < 2) return null;
      const timeIndex = parts.findIndex((p) => /^\d+:\d{2}(:\d{2})?$/.test(p));
      if (timeIndex === -1) return null;
      const nameIndex = timeIndex === 0 ? 1 : 0;
      return { name: parts[nameIndex] ?? "", time: parts[timeIndex] ?? "" };
    })
    .filter(
      (row): row is { name: string; time: string } =>
        row !== null && row.name.length > 0,
    );
}

export function CsvUploadStep({
  onParsed,
  onBack,
}: {
  onParsed: (rows: CsvRow[]) => void;
  onBack: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const { data: allRunners } = useQuery(QUERIES.runner.getAllRunners());

  function processFile(file: File) {
    if (!file.name.endsWith(".csv") && file.type !== "text/csv") {
      setError("Kun CSV-filer støttes.");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCsv(text);
      if (parsed.length === 0) {
        setError(
          "Ingen gyldige rader funnet. Filen må ha kolonnene navn og tid (mm:ss).",
        );
        return;
      }
      const runners = allRunners ?? [];
      const rows: CsvRow[] = parsed.map((p, i) => ({
        id: i,
        csvName: p.name,
        timeSeconds: timeToSeconds(p.time),
        timeRaw: p.time,
        resolvedRunner: findBestMatch(p.name, runners),
      }));
      onParsed(rows);
    };
    reader.readAsText(file, "UTF-8");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }

  return (
    <div className="space-y-4">
      {/** biome-ignore lint/a11y/noStaticElementInteractions: fordi. */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center gap-3 cursor-pointer transition-colors ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <UploadIcon className="size-8 text-muted-foreground" />
        <div className="text-center">
          <p className="font-medium text-sm">
            Dra og slipp CSV-fil her, eller klikk for å velge
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Format: navn, tid (mm:ss eller hh:mm:ss) – en løper per linje
          </p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button variant="outline" onClick={onBack}>
        Tilbake
      </Button>
    </div>
  );
}
