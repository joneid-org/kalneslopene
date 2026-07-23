import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Flag,
  type LucideIcon,
  MapPin,
  Quote,
  Trophy,
  Users,
} from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { MilestoneCard } from "@/components/History/MilestoneCard.tsx";
import { cn } from "@/lib/utils.ts";

const iconMap: Record<string, LucideIcon> = {
  Flag,
  Users,
  Trophy,
  MapPin,
  Calendar,
};

export function History() {
  const { data: milestones = [] } = useQuery(
    QUERIES.milestone.getAllMilestones,
  );

  const sortedMilestones = [...milestones].sort((a, b) => {
    const yearA = Number.parseInt(a.year, 10);
    const yearB = Number.parseInt(b.year, 10);
    return (
      (Number.isNaN(yearA) ? Number.POSITIVE_INFINITY : yearA) -
      (Number.isNaN(yearB) ? Number.POSITIVE_INFINITY : yearB)
    );
  });

  return (
    <div className="page-content">
      <div className="flex flex-col gap-8 sm:gap-14">
        <section className="mx-auto max-w-6xl pt-2 text-center sm:pt-8">
          <span className="inline-block rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:px-3.5 sm:text-[11px] sm:tracking-[0.16em]">
            Siden 1978
          </span>
          <h1 className="mt-4 font-display text-[26px] font-black leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Historien om Torsdagsløpet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
            Over 40 år med fellesskap, frisk luft og gode bein i Kalnesskogen.
            <span className="hidden sm:inline">
              {" "}
              Her er historien bak løpet — fra de første forsiktige stegene til
              en levende lokal tradisjon.
            </span>
          </p>
        </section>

        <section className="mx-auto w-full max-w-6xl">
          <div className="relative">
            <div className="absolute top-1 bottom-1 left-3.5 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-border to-transparent sm:left-1/2" />
            {sortedMilestones.map((milestone, i) => {
              const Icon = iconMap[milestone.icon] ?? Flag;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={milestone.uuid}
                  className={cn(
                    "relative sm:grid sm:grid-cols-[1fr_3rem_1fr] sm:items-center sm:gap-0",
                    i < sortedMilestones.length - 1 && "mb-4 sm:mb-6",
                  )}
                >
                  <div className="absolute left-0 top-0 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:static sm:col-start-2 sm:row-start-1 sm:size-9 sm:justify-self-center sm:shadow-md sm:ring-[5px] sm:ring-background">
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                  <div
                    className={cn(
                      "pl-12 sm:row-start-1 sm:pl-0",
                      isLeft
                        ? "sm:col-start-1 sm:pr-3"
                        : "sm:col-start-3 sm:pl-3",
                    )}
                  >
                    <MilestoneCard milestone={milestone} />
                  </div>
                  {milestone.extra && (
                    <div
                      className={cn(
                        "mt-4 pl-12 sm:row-start-1 sm:mt-0 sm:pl-0",
                        isLeft
                          ? "sm:col-start-3 sm:pl-3"
                          : "sm:col-start-1 sm:pr-3",
                      )}
                    >
                      <div className="rounded-2xl bg-brand-ink px-6 py-8 text-center">
                        <Quote className="mx-auto size-6 fill-brand text-brand" />
                        <blockquote className="mx-auto mt-3 max-w-[24ch] font-display text-base font-bold italic leading-snug tracking-tight text-white sm:text-lg">
                          {milestone.extra}
                        </blockquote>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
