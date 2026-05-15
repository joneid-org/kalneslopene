import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Flag,
  type LucideIcon,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { MilestoneCard } from "@/components/History/MilestoneCard.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const iconMap: Record<string, LucideIcon> = {
  Flag,
  Users,
  Trophy,
  MapPin,
  Calendar,
};

const photos = [
  { label: "Start på 90-tallet", aspect: "aspect-[4/3]" },
  { label: "Premieutdeling 2000", aspect: "aspect-square" },
  { label: "Fellesstart i regnet", aspect: "aspect-[4/3]" },
  { label: "Jubileumsløpet 2015", aspect: "aspect-square" },
];

export function History() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const { data: milestones = [] } = useQuery(
    QUERIES.milestone.getAllMilestones,
  );

  return (
    <div className="page-content section-stack">
      <section className="text-center space-y-3">
        <Badge variant="outline" className="text-xs tracking-widest uppercase">
          Siden 1993
        </Badge>
        <h1 className="page-title">Historien om Torsdagsløpet</h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Over 30 år med fellesskap, frisk luft og gode bein på Kalneskrysset.
          Her er historien bak løpet — fra de første forsiktige stegene til en
          levende lokal tradisjon.
        </p>
      </section>

      <Separator />

      <section>
        <div className="grid grid-cols-2 gap-2 md:gap-3">
          {photos.map(({ label, aspect }) => (
            <div
              key={label}
              className={`${aspect} rounded-lg bg-muted flex items-end overflow-hidden`}
            >
              <span className="w-full bg-black/40 text-white text-xs px-2 py-1 truncate">
                {label}
              </span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Bilder fra arkivet — historiske øyeblikk fra løpets mange år.
        </p>
      </section>

      <Separator />

      <section>
        <h2 className="text-lg font-semibold mb-6">Milepæler</h2>
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
          {milestones.map((milestone, i) => {
            const Icon = iconMap[milestone.icon] ?? Flag;
            const isOpen = expanded === milestone.uuid;
            return (
              <div
                key={milestone.uuid}
                className={`flex gap-4 ${i < milestones.length - 1 ? "pb-8" : ""}`}
              >
                <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                  <Icon className="size-4 text-primary" />
                </div>
                <MilestoneCard
                  milestone={milestone}
                  isOpen={isOpen}
                  onToggle={() =>
                    setExpanded(isOpen ? null : (milestone.uuid ?? null))
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      <section className="text-center py-4 space-y-2">
        <blockquote className="text-xl font-medium italic text-foreground/80">
          "Vi løper ikke for å vinne — vi løper for å møtes."
        </blockquote>
        <p className="text-sm text-muted-foreground">
          — En av grunnleggerne av Torsdagsløpet
        </p>
      </section>
    </div>
  );
}
