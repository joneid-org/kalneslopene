import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { colorIcon } from "@/components/CourseMap/mapUtils.ts";
import { blaaRoute } from "@/data/coordinater.ts";
import { MAP_CENTER, MAP_ZOOM, mapLegend, pins } from "@/data/loypekartData.ts";
import { cn } from "@/lib/utils.ts";
import { PinInfoPanel } from "./PinInfoPanel";

const ROUTE_COLOR = "#1f7a4d";
const ACTIVE_PIN_COLOR = "#f2a33c";

export function CourseMapPins() {
  const [currentIndex, setCurrentIndex] = useState(0);
  return (
    <div className="grid gap-4 md:grid-cols-[1.55fr_1fr] md:items-stretch">
      <div
        className="relative h-80 overflow-hidden rounded-2xl border shadow-sm md:h-auto"
        style={{ zIndex: 0 }}
      >
        <MapContainer
          center={MAP_CENTER}
          zoom={MAP_ZOOM}
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polyline
            positions={blaaRoute}
            pathOptions={{ color: ROUTE_COLOR, weight: 4, opacity: 0.85 }}
          />
          {pins.map((pin, i) => {
            const active = i === currentIndex;
            return (
              <Marker
                key={pin.id}
                position={pin.position}
                icon={colorIcon(
                  active ? ACTIVE_PIN_COLOR : ROUTE_COLOR,
                  active,
                )}
                zIndexOffset={active ? 1000 : 0}
                eventHandlers={{ click: () => setCurrentIndex(i) }}
              >
                <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                  {pin.label}
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
        <div className="pointer-events-none absolute bottom-3 left-3 z-1000 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
          {mapLegend.map(({ color, label }) => (
            <span key={label} className="flex items-center gap-2">
              <span
                className="size-2.5 rounded-full"
                style={{ background: color }}
              />
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="grid">
        {pins.map((pin, i) => (
          <div
            key={pin.id}
            aria-hidden={i !== currentIndex}
            className={cn("[grid-area:1/1]", i !== currentIndex && "invisible")}
          >
            <PinInfoPanel pin={pin} />
          </div>
        ))}
      </div>
    </div>
  );
}
