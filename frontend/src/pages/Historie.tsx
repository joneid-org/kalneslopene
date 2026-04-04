import {
  Calendar,
  ChevronDown,
  Flag,
  type LucideIcon,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
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

export function Historie() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: milestones = [] } = useQuery(
    QUERIES.milestone.getAllMilestones,
  );

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-12">
      {/* Hero */}
      <section className="text-center space-y-3">
        <Badge variant="outline" className="text-xs tracking-widest uppercase">
          Siden 1993
        </Badge>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          Historien om Torsdagsløpet
        </h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Over 30 år med fellesskap, frisk luft og gode bein på Kalneskrysset.
          Her er historien bak løpet — fra de første forsiktige stegene til en
          levende lokal tradisjon.
        </p>
      </section>

      <Separator />

      {/* Photo grid */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Fra arkivet</h2>
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

      {/* Timeline */}
      <section>
        <h2 className="text-lg font-semibold mb-6">Milepæler</h2>
        <div className="relative space-y-0">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />

          {milestones.map(
            ({ uuid, year, icon, title, summary, details, extra }, i) => {
              const Icon = iconMap[icon] ?? Flag;
              const isOpen = expanded === uuid;
              return (
                <div
                  key={uuid}
                  className={`flex gap-4 ${i < milestones.length - 1 ? "pb-8" : ""}`}
                >
                  {/* Icon bubble */}
                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <Icon className="size-4 text-primary" />
                  </div>

                  {/* Content */}
                  <Card
                    className="flex-1 cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setExpanded(isOpen ? null : (uuid ?? null))}
                  >
                    <CardContent className="pt-4 pb-4 space-y-2">
                      {/* Header row */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="text-xs font-mono"
                          >
                            {year}
                          </Badge>
                          <span className="font-semibold text-sm">{title}</span>
                        </div>
                        <ChevronDown
                          className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        />
                      </div>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {summary}
                      </p>

                      {/* Expandable section */}
                      {isOpen && (
                        <div className="pt-3 space-y-3 border-t mt-2">
                          {/* Key facts */}
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {details.map((detail) => {
                              const [label, value] = detail.split(":");
                              return (
                                <div key={label}>
                                  <dt className="text-xs text-muted-foreground">
                                    {label}
                                  </dt>
                                  <dd className="text-sm font-medium">
                                    {value}
                                  </dd>
                                </div>
                              );
                            })}
                          </dl>
                          {/* Extra narrative */}
                          {extra && (
                            <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-3 italic">
                              {extra}
                            </p>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              );
            },
          )}
        </div>
      </section>

      <Separator />

      {/* Closing quote */}
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
