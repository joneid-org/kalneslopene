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
import { Separator } from "@/components/ui/separator.tsx";
import {
  blaaRoute,
  categoryLabel,
  categoryVariant,
  gronnRoute,
  MAP_CENTER,
  MAP_ZOOM,
  mapLegend,
  pins,
  type Pin,
} from "@/data/loypekartData.ts";

// Fix default marker icon paths broken by bundlers
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
        {mapLegend.map(({ color, label }) => (
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
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            style={{ height: "100%", minHeight: "420px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Routes */}
            <Polyline
              positions={blaaRoute}
              pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.8 }}
            />
            <Polyline
              positions={gronnRoute}
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
                eventHandlers={{ click: () => setActivePin(pin) }}
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
