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
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { MilestoneCard } from "@/components/History/MilestoneCard.tsx";
import { cn } from "@/lib/utils.ts";
import historyPhoto from "../images/hero.webp";

const iconMap: Record<string, LucideIcon> = {
  Flag,
  Users,
  Trophy,
  MapPin,
  Calendar,
};

const photos = [
  { year: "1993", caption: "Start på 90-tallet", position: "50% 35%" },
  { year: "2000", caption: "Premieutdeling 2000", position: "50% 50%" },
];

export function History() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: milestones = [] } = useQuery(
    QUERIES.milestone.getAllMilestones,
  );

  return (
    <div className="page-content">
      <div className="flex flex-col gap-8 sm:gap-14">
        <section className="mx-auto max-w-2xl pt-2 text-center sm:pt-8">
          <span className="inline-block rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:px-3.5 sm:text-[11px] sm:tracking-[0.16em]">
            Siden 1978
          </span>
          <h1 className="mt-4 font-display text-[26px] font-black leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Historien om Torsdagsløpet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
            Over 40 år med fellesskap, frisk luft og gode bein på Kalneskrysset.
            <span className="hidden sm:inline">
              {" "}
              Her er historien bak løpet — fra de første forsiktige stegene til
              en levende lokal tradisjon.
            </span>
          </p>
        </section>

        <section className="mx-auto hidden w-full max-w-5xl grid-cols-2 gap-[18px] sm:grid">
          {photos.map(({ year, caption, position }) => (
            <div
              key={caption}
              className="relative h-80 overflow-hidden rounded-2xl bg-muted"
            >
              <img
                src={historyPhoto}
                alt={caption}
                style={{ objectPosition: position }}
                className="size-full object-cover [filter:saturate(0.7)_contrast(0.95)]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-brand-ink/75" />
              <div className="absolute bottom-0 left-0 p-5 text-white">
                <div className="text-xs font-bold uppercase tracking-wide tabular-nums text-white/85">
                  {year}
                </div>
                <div className="font-display text-[17px] font-bold">
                  {caption}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="mx-auto w-full max-w-3xl">
          <div className="mb-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70 sm:mb-2 sm:text-center sm:tracking-[0.14em]">
            Milepæler
          </div>
          <h2 className="mb-9 hidden text-center font-display text-2xl font-extrabold tracking-tight sm:block">
            Fire tiår, steg for steg
          </h2>

          <div className="relative">
            <div className="absolute top-1 bottom-1 left-[14px] w-0.5 -translate-x-1/2 bg-border sm:left-1/2" />
            {milestones.map((milestone, i) => {
              const Icon = iconMap[milestone.icon] ?? Flag;
              const isOpen = expanded === milestone.uuid;
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={milestone.uuid}
                  className={cn(
                    "relative sm:grid sm:grid-cols-[1fr_3rem_1fr] sm:items-center sm:gap-0",
                    i < milestones.length - 1 && "mb-4 sm:mb-6",
                  )}
                >
                  <div className="absolute left-0 top-0 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground sm:static sm:col-start-2 sm:row-start-1 sm:size-9 sm:justify-self-center sm:ring-[5px] sm:ring-background">
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                  <div
                    className={cn(
                      "pl-12 sm:row-start-1 sm:pl-0",
                      isLeft ? "sm:col-start-1" : "sm:col-start-3",
                    )}
                  >
                    <MilestoneCard
                      milestone={milestone}
                      isOpen={isOpen}
                      onToggle={() =>
                        setExpanded(isOpen ? null : (milestone.uuid ?? null))
                      }
                      align={isLeft ? "right" : "left"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl">
          <div className="rounded-2xl bg-brand-ink px-6 py-10 text-center sm:px-10 sm:py-12">
            <Quote className="mx-auto size-7 fill-brand text-brand sm:size-8" />
            <blockquote className="mx-auto mt-4 max-w-[20ch] font-display text-lg font-bold italic leading-snug tracking-tight text-white sm:text-3xl">
              Vi løper ikke for å vinne — vi løper for å møtes.
            </blockquote>
            <p className="mt-3 text-xs text-white/60 sm:text-sm">
              — En av grunnleggerne av Torsdagsløpet
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
