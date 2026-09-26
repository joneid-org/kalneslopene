import { ChevronRight } from "lucide-react";
import { Link } from "react-router";
import { StatCard } from "@/components/Statistics/StatCard.tsx";
import { runnerStatisticsPath } from "@/lib/constants.ts";
import { cn } from "@/lib/utils.ts";
import type { TopParticipantDTO } from "@/model/DTO.ts";

type Props = {
  title: string;
  subtitle?: string;
  participants: TopParticipantDTO[];
};

export function TopParticipantsList({ title, subtitle, participants }: Props) {
  if (participants.length === 0) return null;

  return (
    <StatCard title={title} subtitle={subtitle}>
      <ol className="-mx-2 flex flex-col">
        {participants.map((p) => {
          const rank =
            participants.findIndex((other) => other.races === p.races) + 1;
          return (
            <li key={p.runner.uuid}>
              <Link
                to={runnerStatisticsPath(p.runner.uuid)}
                className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-accent"
              >
                <span
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums",
                    rank <= 3
                      ? "bg-brand text-brand-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {rank}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                  {p.runner.name}
                </span>
                <span className="font-display text-[15px] font-extrabold tabular-nums">
                  {p.races}
                  <span className="ml-1 text-xs font-semibold text-muted-foreground">
                    løp
                  </span>
                </span>
                <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
              </Link>
            </li>
          );
        })}
      </ol>
    </StatCard>
  );
}
