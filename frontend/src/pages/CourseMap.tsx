import { useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { colorIcon } from "@/components/CourseMap/mapUtils.ts";
import { PinInfoPanel } from "@/components/CourseMap/PinInfoPanel.tsx";
import { RoutePhotoGallery } from "@/components/CourseMap/RoutePhotoGallery.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { blaaRoute } from "@/data/coordinater";
import {
  MAP_CENTER,
  MAP_ZOOM,
  mapLegend,
  type Pin,
  pins,
  routePhotos,
} from "@/data/loypekartData.ts";

import type { S3FileDto } from "@/model/DTO.ts"; // Adapt RoutePhoto to the Photo shape PhotoDialog expects

// Adapt RoutePhoto to the Photo shape PhotoDialog expects
const dialogPhotos: S3FileDto[] = routePhotos.map((rp) => ({
  url: rp.imageUrl,
  description: rp.title,
  raceId: rp.id,
  uuid: rp.id,
}));

export function CourseMap() {
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const activePinPhoto = activePin
    ? routePhotos.find((rp) => rp.id === `rp-${activePin.id}`)
    : undefined;

  const activePinDialogIndex = activePinPhoto
    ? // biome-ignore lint/suspicious/noTsIgnore: TODO: Refactor to avoid this
      // @ts-ignore
      dialogPhotos.findIndex((p) => p.raceId === activePinPhoto.id)
    : -1;

  return (
    <div className="page-content space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold tracking-tight">Løypekart</h1>
        <p className="text-muted-foreground text-sm">
          Klikk på en pin i kartet for å se informasjon om stedet.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 text-xs">
        {mapLegend.map(({ color, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span
              className="inline-block size-3 rounded-full border border-white shadow"
              style={{ background: color }}
            />
            <span className="text-muted-foreground">{label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="flex-1 rounded-xl overflow-hidden border shadow-sm min-h-80"
          style={{ zIndex: 0 }}
        >
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            style={{ height: "100%", minHeight: "320px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Polyline
              positions={blaaRoute}
              pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.8 }}
            />
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
        <div className="md:w-96 shrink-0">
          <PinInfoPanel
            pin={activePin}
            onClose={() => setActivePin(null)}
            photo={activePinPhoto}
            onPhotoClick={() =>
              activePinDialogIndex >= 0 &&
              setLightboxIndex(activePinDialogIndex)
            }
          />
        </div>
      </div>

      <Separator />

      <RoutePhotoGallery photos={routePhotos} />

      <PhotoDialog
        photos={dialogPhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
      />
    </div>
  );
}
