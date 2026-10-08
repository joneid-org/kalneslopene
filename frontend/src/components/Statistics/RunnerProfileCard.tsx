import { cn, genderLabel } from "@/lib/utils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

type Props = {
  runner: RunnerDTO;
  personalRecord: string;
  totalRaces: number;
  seasons: number;
  isLoading: boolean;
};

function getInitials(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  return words
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function ProfileStat({
  value,
  label,
  highlight = false,
  isLoading,
}: {
  value: string | number;
  label: string;
  highlight?: boolean;
  isLoading: boolean;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-white/10 px-2 py-2.5 text-center">
      {isLoading ? (
        <div className="mx-auto h-5 w-10 animate-pulse rounded bg-white/20" />
      ) : (
        <div
          className={cn(
            "font-display text-lg font-extrabold leading-tight tabular-nums",
            highlight && "text-brand",
          )}
        >
          {value}
        </div>
      )}
      <div className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-wide text-white/60">
        {label}
      </div>
    </div>
  );
}

export function RunnerProfileCard({
  runner,
  personalRecord,
  totalRaces,
  seasons,
  isLoading,
}: Props) {
  return (
    <div className="rounded-2xl bg-brand-ink p-4 text-white md:p-5">
      <div className="flex items-center gap-3.5">
        <div className="grid size-12 shrink-0 place-items-center rounded-full bg-brand font-display text-base font-extrabold text-brand-foreground">
          {getInitials(runner.name)}
        </div>
        <div className="min-w-0">
          <h2 className="truncate font-display text-lg font-extrabold tracking-tight md:text-xl">
            {runner.name}
          </h2>
          <span className="mt-0.5 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/80">
            {genderLabel(runner.gender)}
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        <ProfileStat
          value={personalRecord}
          label="Personlig rekord"
          highlight
          isLoading={isLoading}
        />
        <ProfileStat
          value={totalRaces}
          label="Løp fullført siden 2019"
          isLoading={isLoading}
        />
        <ProfileStat value={seasons} label="Sesonger" isLoading={isLoading} />
      </div>
    </div>
  );
}
