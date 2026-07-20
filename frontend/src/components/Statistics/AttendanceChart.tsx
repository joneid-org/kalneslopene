import { formatDayMonthShort, formatDDMonth } from "@/lib/timeUtils.ts";
import { cn } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type Props = {
  races: RaceDTO[];
};

function niceStep(value: number): number {
  if (value <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const nice =
    normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return nice * magnitude;
}

export function AttendanceChart({ races }: Props) {
  if (races.length === 0) return null;

  const rawMax = Math.max(...races.map((r) => r.runnerCount), 1);
  const step = niceStep(rawMax / 4);
  const axisMax = step * Math.ceil(rawMax / step);

  const ticks: number[] = [];
  for (let v = axisMax; v >= 0; v -= step) ticks.push(v);

  const targetLabels = Math.min(races.length, 5);
  const labelIndices = [
    ...new Set(
      targetLabels <= 1
        ? [0]
        : Array.from({ length: targetLabels }, (_, k) =>
            Math.round((k * (races.length - 1)) / (targetLabels - 1)),
          ),
    ),
  ];

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="mb-4 font-display text-base font-extrabold tracking-tight">
        Frammøte gjennom sesongen
      </h3>

      <div className="flex gap-2">
        <div className="flex h-32 flex-col justify-between text-[10px] tabular-nums text-muted-foreground">
          {ticks.map((t) => (
            <span key={t} className="leading-none">
              {t}
            </span>
          ))}
        </div>

        <div className="min-w-0 flex-1">
          <div className="relative h-32">
            {ticks.map((t) => (
              <div
                key={t}
                className="absolute inset-x-0 border-t border-border/60"
                style={{ bottom: `${(t / axisMax) * 100}%` }}
              />
            ))}
            <div className="absolute inset-0 flex items-end gap-1">
              {races.map((race) => {
                const isMax = race.runnerCount === rawMax;
                return (
                  <div
                    key={race.uuid}
                    className={cn(
                      "group relative flex-1 rounded-t-md transition-colors",
                      isMax ? "bg-brand" : "bg-primary/25",
                    )}
                    style={{
                      height: `${Math.max((race.runnerCount / axisMax) * 100, 5)}%`,
                    }}
                  >
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-brand-ink px-2 py-1 text-center text-white group-hover:block">
                      <div className="font-semibold">
                        {formatDDMonth(race.raceDate)}
                      </div>
                      <div className="text-[11px] text-white/70">
                        {race.runnerCount} deltakere
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-2.5 h-8 text-[10px] tabular-nums text-muted-foreground sm:h-4">
            {labelIndices.map((i) => {
              const isFirst = i === 0;
              const isLast = i === races.length - 1;
              const style = isFirst
                ? { left: 0 }
                : isLast
                  ? { right: 0 }
                  : { left: `${((i + 0.5) / races.length) * 100}%` };
              return (
                <span
                  key={races[i].uuid}
                  className={cn(
                    "absolute origin-top-right -rotate-45 whitespace-nowrap leading-none sm:origin-center sm:rotate-0",
                    !isFirst && !isLast && "-translate-x-1/2",
                  )}
                  style={style}
                >
                  <span className="sm:hidden">
                    {formatDayMonthShort(races[i].raceDate)}
                  </span>
                  <span className="hidden sm:inline">
                    {formatDDMonth(races[i].raceDate)}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
