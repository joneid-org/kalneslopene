import { AlertTriangleIcon, Loader2Icon, RocketIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import { WeatherLine } from "@/components/Weather/WeatherLine.tsx";
import { formatSecondsToTime } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";
import type { RacePatch } from "./helpers.ts";
import { entryHasTime, entrySeconds } from "./helpers.ts";

function Warning({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-2 rounded-md border border-orange-300 bg-orange-50 p-3 text-sm dark:border-orange-900 dark:bg-orange-950/30">
      <AlertTriangleIcon className="size-4 shrink-0 text-orange-500" />
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{children}</p>
      </div>
    </div>
  );
}

export function PublishStep({
  entries,
  race,
  onPublish,
  isPublishing,
}: {
  entries: RaceRunnerDTO[];
  /** Sanitized patch from the wizard form, or null when the form is invalid. */
  race: RacePatch | null;
  onPublish: () => void;
  isPublishing: boolean;
}) {
  const missingTime = entries.filter((e) => !entryHasTime(e));
  const unverified = entries.filter((e) => !e.runner.isVerified);
  const resultsReady = entries.length > 0 && missingTime.length === 0;
  const canPublish = resultsReady && !!race;

  return (
    <div className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Publiser</h2>
        <p className="text-sm text-muted-foreground">
          Når du publiserer blir resultatene synlige på nettsiden. Løperne er
          allerede opprettet i databasen.
        </p>
      </div>

      <div className="space-y-2 rounded-md border p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Antall løpere</span>
          <span className="font-medium">{entries.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Ubekreftede løpere</span>
          <span className="font-medium">{unverified.length}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Vær</span>
          <span className="font-medium text-right">
            {race?.weather ? (
              <WeatherLine weather={race.weather} className="justify-end" />
            ) : (
              <span className="italic text-muted-foreground">
                Ikke registrert
              </span>
            )}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Løypeforhold</span>
          <span className="font-medium text-right">
            {race?.courseCondition || (
              <span className="italic text-muted-foreground">
                Ikke registrert
              </span>
            )}
          </span>
        </div>
      </div>

      {missingTime.length > 0 && (
        <Warning title={`${missingTime.length} løper(e) mangler tid`}>
          {missingTime.map((e) => e.runner.name).join(", ")}
        </Warning>
      )}

      {unverified.length > 0 && (
        <Warning title={`${unverified.length} løper(e) er ikke bekreftet`}>
          Bekreft nye løpere i «Se over» før du publiserer.
        </Warning>
      )}

      {!race && (
        <Warning title="Ugyldige verdier i vær eller løypeforhold">
          Rett opp de røde feltene i «Se over» før du publiserer.
        </Warning>
      )}

      {resultsReady && (
        <div className="max-h-64 divide-y overflow-y-auto rounded-md border">
          {entries.map((e) => (
            <div
              key={e.runner.uuid}
              className="flex items-center justify-between px-3 py-1.5 text-sm"
            >
              <span className="font-medium">{e.runner.name}</span>
              <span className="font-mono text-xs tabular-nums text-muted-foreground">
                {e.hideTime
                  ? "Kun deltatt"
                  : formatSecondsToTime(entrySeconds(e) ?? 0)}
              </span>
            </div>
          ))}
        </div>
      )}

      <Button
        className="w-full gap-2"
        size="lg"
        disabled={!canPublish || isPublishing}
        onClick={onPublish}
      >
        {isPublishing ? (
          <Loader2Icon className="size-4 animate-spin" />
        ) : (
          <RocketIcon className="size-4" />
        )}
        Publiser resultater
      </Button>
    </div>
  );
}
