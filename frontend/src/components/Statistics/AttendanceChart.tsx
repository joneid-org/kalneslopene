import { formatDDMonth } from "@/lib/timeUtils.ts";
import { cn } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type Props = {
  races: RaceDTO[];
};

export function AttendanceChart({ races }: Props) {
  if (races.length === 0) return null;

  const max = Math.max(...races.map((r) => r.runnerCount), 1);

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-4 font-display text-base font-extrabold tracking-tight">
        Frammøte gjennom sesongen
      </h3>
      <div className="flex h-32 items-end gap-1">
        {races.map((race) => {
          const isMax = race.runnerCount === max;
          return (
            <div
              key={race.uuid}
              title={`${formatDDMonth(race.raceDate)}: ${race.runnerCount} deltakere`}
              className={cn(
                "flex-1 rounded-t-md transition-colors",
                isMax ? "bg-brand" : "bg-primary/25",
              )}
              style={{
                height: `${Math.max((race.runnerCount / max) * 100, 5)}%`,
              }}
            />
          );
        })}
      </div>
      <div className="mt-2.5 flex justify-between text-[10px] tabular-nums text-muted-foreground">
        <span>{formatDDMonth(races[0].raceDate)}</span>
        <span>{formatDDMonth(races[races.length - 1].raceDate)}</span>
      </div>
    </div>
  );
}
