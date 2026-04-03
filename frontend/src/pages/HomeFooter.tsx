import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, Phone } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { getContactPerson } from "@/lib/utils.ts";

const sponsors = [
  { name: "Kiwi", url: "https://kiwi.no/", initials: "Kiwi" },
  { name: "XXL", url: "https://www.xxl.no/", initials: "XXL" },
];

export default function HomeFooter() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);
  const SLOGAN =
    "Fellesskap og frisk luft — hver torsdag i Kalnesskogen, siden 1978.";

  return (
    <footer className="bg-card border-t">
      <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold tracking-tight">Torsdagsløpet</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {SLOGAN}
          </p>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            Kontakt
          </h3>
          <ul className="space-y-1">
            <li>
              <a
                href={`mailto:${mainContact?.email}`}
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
              >
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted group-hover:bg-accent transition-colors shrink-0">
                  <Mail className="size-2.5" />
                </span>
                {mainContact?.email}
              </a>
            </li>
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0">
                <Phone className="size-2.5" />
              </span>
              +47 {mainContact?.phone}
            </li>
            <li className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-muted shrink-0">
                <MapPin className="size-2.5" />
              </span>
              Gamle Kongevei 1712, 1712 Grålum
            </li>
          </ul>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Sponsorer
            </h3>
            <a
              href={`mailto:${mainContact?.email}`}
              className="text-[10px] px-2 py-0.5 rounded-full border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
            >
              Bli sponsor →
            </a>
          </div>
          <div className="flex gap-2">
            {sponsors.map(({ name, url, initials }) => (
              <a
                key={name}
                href={url}
                title={name}
                className="flex-1 flex flex-col items-center justify-center gap-1 rounded-lg border bg-muted/40 hover:bg-muted transition-colors py-2 group"
              >
                <div className="w-8 h-8 rounded-full bg-background border flex items-center justify-center text-[10px] font-bold text-muted-foreground group-hover:text-foreground transition-colors">
                  {initials}
                </div>
                <span className="text-[10px] text-center text-muted-foreground group-hover:text-foreground transition-colors leading-tight px-1">
                  {name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <Separator />

      <div className="max-w-5xl mx-auto px-6 py-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>© {new Date().getFullYear()} Torsdagsløpet</span>
        <div className="flex items-center gap-3">
          <span>Drevet av frivillige ❤️</span>
          <a
            href="/admin"
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
