import { useCallback, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { requestStaticPresignedUrl, uploadToS3 } from "@/api/s3.ts";
import { colorIcon } from "@/components/CourseMap/mapUtils.ts";
import { PinInfoPanel } from "@/components/CourseMap/PinInfoPanel.tsx";
import { RoutePhotoGallery } from "@/components/CourseMap/RoutePhotoGallery.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { blaaRoute } from "@/data/coordinater";
import {
  MAP_CENTER,
  MAP_ZOOM,
  mapLegend,
  type Pin,
  pins,
} from "@/data/loypekartData.ts";
import { convertImageToWebp } from "@/lib/imageUtils.ts";

const basePinPhotos = pins.flatMap((pin) =>
  (pin.photos ?? []).map((photo) => ({ ...photo, label: pin.label })),
);

/**
 * Builds the displayed image URL from the runtime S3 base URL (falling back to
 * the placeholder until config has loaded), plus a cache-busting param so a
 * replaced image reloads instead of being served from cache.
 */
function resolvePhotoUrl(
  fileName: string,
  fallback: string,
  s3BaseUrl: string | undefined,
  version?: number,
): string {
  const base = s3BaseUrl ? `${s3BaseUrl}/static/${fileName}` : fallback;
  return version
    ? `${base}${base.includes("?") ? "&" : "?"}v=${version}`
    : base;
}

export function CourseMap() {
  const { isAuthenticated } = useAuth();
  const { s3BaseUrl } = useApplicationContext();
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [photoVersions, setPhotoVersions] = useState<Record<string, number>>(
    {},
  );

  const handleReplacePhoto = useCallback(
    async (fileName: string, file: File) => {
      const webpFile = await convertImageToWebp(file);
      const uploadUrl = await requestStaticPresignedUrl(fileName);
      await uploadToS3(webpFile, uploadUrl);
      setPhotoVersions((prev) => ({ ...prev, [fileName]: Date.now() }));
    },
    [],
  );

  const allPinPhotos = useMemo(
    () =>
      basePinPhotos.map(({ fileName, fallback, description, label }) => ({
        fileName,
        description,
        label,
        url: resolvePhotoUrl(
          fileName,
          fallback,
          s3BaseUrl,
          photoVersions[fileName],
        ),
      })),
    [s3BaseUrl, photoVersions],
  );

  const activePinDialogPhotos = useMemo(
    () =>
      (activePin?.photos ?? []).map(({ fileName, fallback, description }) => ({
        fileName,
        description,
        url: resolvePhotoUrl(
          fileName,
          fallback,
          s3BaseUrl,
          photoVersions[fileName],
        ),
      })),
    [activePin, s3BaseUrl, photoVersions],
  );

  const activePinPhoto = activePinDialogPhotos[0];
  const onReplacePhoto = isAuthenticated ? handleReplacePhoto : undefined;

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
            onPhotoClick={() => setLightboxIndex(0)}
          />
        </div>
      </div>

      <Separator />

      <RoutePhotoGallery
        photos={allPinPhotos}
        onReplacePhoto={onReplacePhoto}
      />

      <PhotoDialog
        photos={activePinDialogPhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onReplacePhoto={onReplacePhoto}
      />
    </div>
  );
}
