import { useQuery } from "@tanstack/react-query";
import { CheckIcon, CopyIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Textarea } from "@/components/ui/textarea.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import { buildTableRows, formatResultsAsText } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function ExportResultsDialog({
  race,
  onClose,
}: {
  race: RaceDTO;
  onClose: () => void;
}) {
  const {
    data: runners,
    isPending,
    isError,
  } = useQuery(QUERIES.race.getAllRunnersInRace(race.uuid));
  const [copied, setCopied] = useState(false);

  const text = runners ? formatResultsAsText(buildTableRows(runners)) : "";

  async function copyText() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  }

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Resultatliste {formatDDMonth(race.raceDate)}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">
        Kopier listen og lim den inn i e-post eller melding.
      </p>

      {isPending ? (
        <p className="flex items-center gap-2 py-6 text-sm text-muted-foreground italic">
          <Loader2Icon className="size-4 animate-spin" />
          Laster resultater...
        </p>
      ) : isError ? (
        <p className="py-6 text-sm text-destructive">
          Kunne ikke laste resultatene.
        </p>
      ) : text === "" ? (
        <p className="py-6 text-sm text-muted-foreground italic">
          Ingen løpere registrert på dette løpet.
        </p>
      ) : (
        <Textarea
          readOnly
          value={text}
          className="h-64 font-mono text-xs"
          onFocus={(e) => e.currentTarget.select()}
        />
      )}

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Lukk
        </Button>
        <Button className="gap-1.5" disabled={text === ""} onClick={copyText}>
          {copied ? (
            <CheckIcon className="size-4" />
          ) : (
            <CopyIcon className="size-4" />
          )}
          {copied ? "Kopiert" : "Kopier"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
