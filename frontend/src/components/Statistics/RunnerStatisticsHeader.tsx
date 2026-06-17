import type { RunnerDTO } from "@/model/DTO.ts";

type Props = {
  runner: RunnerDTO;
};

function getInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function RunnerStatisticsHeader({ runner }: Props) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl border bg-card p-4">
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-secondary font-display text-base font-extrabold text-secondary-foreground">
        {getInitials(runner.name)}
      </div>
      <div className="min-w-0">
        <div className="truncate font-display text-base font-extrabold tracking-tight md:text-lg">
          {runner.name}
        </div>
        <span className="mt-1 inline-block rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-secondary-foreground">
          {runner.gender}
        </span>
      </div>
    </div>
  );
}
