import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx"; // Fix default marker icon paths broken by bundlers

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Colour-coded pin icons
function colorIcon(color: string) {
  return L.divIcon({
    className: "",
    html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.4);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -30],
  });
}

type Pin = {
  id: string;
  label: string;
  position: [number, number];
  color: string;
  category: "start" | "vending" | "poi" | "mal";
  distance: string;
  description: string;
  tips?: string;
};

const pins: Pin[] = [
  {
    id: "start",
    label: "Start / Mål",
    position: [58.3452, 8.5931],
    color: "#16a34a",
    category: "start",
    distance: "0 / 8 km",
    description:
      "Samlingspunktet for alle løpere. Her gis det informasjon om løypen, og tidtakingen starter og stopper her.",
    tips: "Møt opp senest 10 minutter før start. Parkering er tilgjengelig like ved.",
  },
  {
    id: "v1",
    label: "Vendepunkt blå løype",
    position: [58.3521, 8.6095],
    color: "#2563eb",
    category: "vending",
    distance: "4 km",
    description:
      "Vendepunktet for blå løype (ca. 8 km). Herfra snur du og følger samme trase tilbake til mål.",
    tips: "God mulighet til å sjekke tempoet — du er halvveis!",
  },
  {
    id: "v2",
    label: "Vendepunkt grønn løype",
    position: [58.3488, 8.6008],
    color: "#16a34a",
    category: "vending",
    distance: "2 km",
    description:
      "Vendepunktet for grønn løype (ca. 4 km). Perfekt for yngre løpere og mosjonister.",
  },
  {
    id: "poi1",
    label: "Utsiktspunkt",
    position: [58.351, 8.5975],
    color: "#d97706",
    category: "poi",
    distance: "ca. 2,5 km",
    description:
      "Et flott utsiktspunkt med fin sikt over Aust-Agder. Populært hvilestopp på treningsøkter.",
    tips: "Stopp opp og nyt utsikten — du fortjener det!",
  },
  {
    id: "poi2",
    label: "Bratt bakke",
    position: [58.3475, 8.5988],
    color: "#dc2626",
    category: "poi",
    distance: "ca. 1,5 km",
    description:
      "Den beryktet bratte bakken som tester både ben og vilje. Mange velger å gå her — og det er helt greit!",
    tips: "Kort og intens — hold igjen litt i bunn så du har krefter til toppen.",
  },
  {
    id: "poi3",
    label: "Skogsti",
    position: [58.3535, 8.604],
    color: "#7c3aed",
    category: "poi",
    distance: "ca. 3,5 km",
    description:
      "En fin seksjon gjennom tett granskog med mykt underlag. Behagelig å løpe, men pass på røtter i bakken.",
  },
];

// Approximate route polyline (blå løype — full 8 km loop)
const routeCoords: [number, number][] = [
  [58.3452, 8.5931],
  [58.3465, 8.595],
  [58.3475, 8.5988],
  [58.3488, 8.6008],
  [58.351, 8.5975],
  [58.3535, 8.604],
  [58.3521, 8.6095],
  [58.3505, 8.611],
  [58.349, 8.608],
  [58.347, 8.605],
  [58.3455, 8.601],
  [58.3452, 8.5931],
];

// Grønn løype branches off earlier
const greenRoute: [number, number][] = [
  [58.3452, 8.5931],
  [58.3465, 8.595],
  [58.3475, 8.5988],
  [58.3488, 8.6008],
  [58.3475, 8.5988],
  [58.3465, 8.595],
  [58.3452, 8.5931],
];

const categoryLabel: Record<Pin["category"], string> = {
  start: "Start / Mål",
  vending: "Vendepunkt",
  poi: "Interessepunkt",
  mal: "Mål",
};

const categoryVariant: Record<
  Pin["category"],
  "default" | "secondary" | "outline" | "destructive"
> = {
  start: "default",
  vending: "secondary",
  poi: "outline",
  mal: "default",
};

export function Loypekart() {
  const [activePin, setActivePin] = useState<Pin | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Løypekart</h1>
        <p className="text-muted-foreground text-sm">
          Klikk på en pin i kartet for å se informasjon om stedet.
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        {(
          [
            { color: "#16a34a", label: "Start / Mål & grønn løype" },
            { color: "#2563eb", label: "Blå løype (8 km)" },
            { color: "#d97706", label: "Utsiktspunkt" },
            { color: "#dc2626", label: "Krevende parti" },
            { color: "#7c3aed", label: "Interessepunkt" },
          ] as const
        ).map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full border border-white shadow"
              style={{ background: color }}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      {/* Map + info panel */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border shadow-sm min-h-105">
          <MapContainer
            center={[58.349, 8.601]}
            zoom={14}
            style={{ height: "100%", minHeight: "420px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Routes */}
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: "#2563eb",
                weight: 4,
                opacity: 0.8,
                dashArray: undefined,
              }}
            />
            <Polyline
              positions={greenRoute}
              pathOptions={{
                color: "#16a34a",
                weight: 3,
                opacity: 0.7,
                dashArray: "6 4",
              }}
            />

            {/* Pins */}
            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={pin.position}
                icon={colorIcon(pin.color)}
                eventHandlers={{
                  click: () => {
                    setActivePin(pin);
                  },
                }}
              >
                <Tooltip direction="top" offset={[0, -30]} opacity={0.9}>
                  {pin.label}
                </Tooltip>
                <Popup>
                  <strong>{pin.label}</strong>
                  <br />
                  <span className="text-xs text-gray-500">{pin.distance}</span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Info panel */}
        <div className="md:w-72 shrink-0">
          {activePin ? (
            <Card className="h-full">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-snug">
                    {activePin.label}
                  </CardTitle>
                  <button
                    type="button"
                    onClick={() => setActivePin(null)}
                    className="text-muted-foreground hover:text-foreground text-lg leading-none mt-0.5"
                    aria-label="Lukk"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <Badge
                    variant={categoryVariant[activePin.category]}
                    className="text-xs"
                  >
                    {categoryLabel[activePin.category]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {activePin.distance}
                  </span>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-4 space-y-3">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activePin.description}
                </p>
                {activePin.tips && (
                  <div className="rounded-md bg-muted px-3 py-2 text-sm border-l-2 border-primary">
                    <span className="font-medium text-xs uppercase tracking-wide text-primary">
                      Tips
                    </span>
                    <p className="text-muted-foreground mt-0.5">
                      {activePin.tips}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center border-dashed">
              <CardContent className="text-center py-10 space-y-2">
                <p className="text-2xl">📍</p>
                <p className="text-sm text-muted-foreground">
                  Klikk på en pin i kartet for å se detaljer om punktet.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
