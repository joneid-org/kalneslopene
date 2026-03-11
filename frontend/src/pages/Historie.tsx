import {
  Calendar,
  ChevronDown,
  Flag,
  MapPin,
  Trophy,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const milestones = [
  {
    year: "1993",
    icon: Flag,
    title: "Det hele starter",
    text: "En liten gjeng løpere møtes for første gang på Kalneskrysset en torsdag kveld. Ingen visste at dette skulle bli starten på en langvarig tradisjon.",
    details: [
      { label: "Antall deltakere", value: "~12 løpere" },
      { label: "Distanse", value: "Ca. 5 km" },
      { label: "Initiativtaker", value: "Lokale ildsjeler fra Grimsgaard" },
    ],
    extra:
      "Det første løpet ble arrangert uten tidtaking, premier eller offisiell påmelding. Folk møtte opp fordi det var gøy — og det var nok. Etter løpet samlet alle seg til kaffe og prat, en tradisjon som har holdt seg siden.",
  },
  {
    year: "2000",
    icon: Users,
    title: "Vokser i antall",
    text: "Løpet vokser raskt i popularitet. Familier, mosjonister og seriøse løpere finner veien til start, og fellesskapet blomstrer.",
    details: [
      { label: "Antall deltakere", value: "~80 løpere per uke" },
      { label: "Årssesongen", value: "Mai–september" },
      { label: "Nytt", value: "Premieutdeling innføres" },
    ],
    extra:
      "Med flere deltakere kom behovet for bedre organisering. Frivillige tok ansvar for tidtaking og resultatlister, og for første gang ble det delt ut premier til de tre raskeste i ulike klasser.",
  },
  {
    year: "2007",
    icon: MapPin,
    title: "Ny løype",
    text: "Løypen utvides og to distanser innføres — blå og grønn løype — slik at alle kan finne sin utfordring.",
    details: [
      { label: "Blå løype", value: "Ca. 8 km" },
      { label: "Grønn løype", value: "Ca. 4 km" },
      { label: "Terreng", value: "Skog og grusveier" },
    ],
    extra:
      "Den nye løypen ble til etter innspill fra deltakerne. Mange ønsket en lengre og mer krevende rute, mens barnefamilier trengte noe kortere. Den todelte løypestrukturen har blitt en av løpets viktigste særpreg.",
  },
  {
    year: "2015",
    icon: Trophy,
    title: "200 løp gjennomført",
    text: "En stor milepæl nås: det 200. torsdagsløpet arrangeres, feiret med ekstra premiering og gammel moro.",
    details: [
      { label: "Jubileumsuke", value: "Uke 28, 2015" },
      { label: "Fremmøte", value: "Rekordmange deltakere" },
      { label: "Spesielt", value: "Tidligere vinnere invitert tilbake" },
    ],
    extra:
      "Jubileumsløpet samlet løpere fra alle tiår. Det ble holdt tale, servert kake og delt ut miniatyrpokaler til alle som hadde deltatt i mer enn 50 løp. En kveld ingen av de fremmøtte glemmer.",
  },
  {
    year: "2023",
    icon: Calendar,
    title: "30 år med løping",
    text: "Jubileumssesongen markeres med spesielle arrangementer, tilbakeblikk og en samling av løpere fra alle årganger.",
    details: [
      { label: "Sesongens løp", value: "18 torsdager" },
      { label: "Totalt siden start", value: "400+ gjennomførte løp" },
      { label: "Aktivt styre", value: "7 frivillige" },
    ],
    extra:
      "Til 30-årsjubileet ble det laget en egen jubileumsbrosjyre med historikk, bilder og statistikk. Arrangementet fikk omtale i lokalavisen, og det ble arrangert et eget veterans-heat for løpere over 60 år.",
  },
];

const photos = [
  { label: "Start på 90-tallet", aspect: "aspect-[4/3]" },
  { label: "Premieutdeling 2000", aspect: "aspect-square" },
  { label: "Fellesstart i regnet", aspect: "aspect-[4/3]" },
  { label: "Jubileumsløpet 2015", aspect: "aspect-square" },
];

export function Historie() {
  const [expanded, setExpanded] = useState<string | null>(null);

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
            ({ year, icon: Icon, title, text, details, extra }, i) => {
              const isOpen = expanded === year;
              return (
                <div
                  key={year}
                  className={`flex gap-4 ${i < milestones.length - 1 ? "pb-8" : ""}`}
                >
                  {/* Icon bubble */}
                  <div className="relative z-10 shrink-0 w-10 h-10 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <Icon className="size-4 text-primary" />
                  </div>

                  {/* Content */}
                  <Card
                    className="flex-1 cursor-pointer transition-shadow hover:shadow-md"
                    onClick={() => setExpanded(isOpen ? null : year)}
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
                        {text}
                      </p>

                      {/* Expandable section */}
                      {isOpen && (
                        <div className="pt-3 space-y-3 border-t mt-2">
                          {/* Key facts */}
                          <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                            {details.map(({ label, value }) => (
                              <div key={label}>
                                <dt className="text-xs text-muted-foreground">
                                  {label}
                                </dt>
                                <dd className="text-sm font-medium">{value}</dd>
                              </div>
                            ))}
                          </dl>
                          {/* Extra narrative */}
                          <p className="text-sm text-muted-foreground leading-relaxed border-l-2 border-primary pl-3 italic">
                            {extra}
                          </p>
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
