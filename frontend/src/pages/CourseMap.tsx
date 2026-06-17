import { useCallback, useMemo, useState } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import { requestStaticPresignedUrl, uploadToS3 } from "@/api/s3.ts";
import { colorIcon } from "@/components/CourseMap/mapUtils.ts";
import { PinInfoPanel } from "@/components/CourseMap/PinInfoPanel.tsx";
import { RoutePhotoGallery } from "@/components/CourseMap/RoutePhotoGallery.tsx";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import { useApplicationContext } from "@/context/ApplicationContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { blaaRoute } from "@/data/coordinater";
import { MAP_CENTER, MAP_ZOOM, mapLegend, pins } from "@/data/loypekartData.ts";
import { convertImageToWebp } from "@/lib/imageUtils.ts";

const ROUTE_COLOR = "#1f7a4d";
const ACTIVE_PIN_COLOR = "#f2a33c";

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
  const [currentIndex, setCurrentIndex] = useState(0);
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

  const total = pins.length;
  const currentPin = pins[currentIndex];
  const currentPhoto = currentPin.photos?.[0];
  const currentImageUrl = currentPhoto
    ? resolvePhotoUrl(
        currentPhoto.fileName,
        currentPhoto.fallback,
        s3BaseUrl,
        photoVersions[currentPhoto.fileName],
      )
    : undefined;

  const lightboxPhotos = useMemo(
    () =>
      (currentPin.photos ?? []).map(({ fileName, fallback, description }) => ({
        fileName,
        description,
        url: resolvePhotoUrl(
          fileName,
          fallback,
          s3BaseUrl,
          photoVersions[fileName],
        ),
      })),
    [currentPin, s3BaseUrl, photoVersions],
  );

  const onReplacePhoto = isAuthenticated ? handleReplacePhoto : undefined;
  const openLightbox = () => currentPhoto && setLightboxIndex(0);
  const goPrev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const goNext = () => setCurrentIndex((i) => (i + 1) % total);

  return (
    <div className="page-content flex flex-col gap-5 md:gap-6">
      <div>
        <h1 className="page-title">Løypekart</h1>
        <p className="page-subtitle mt-1">
          Klikk på en pin i kartet for å se informasjon om stedet langs ruten.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-[1.55fr_1fr] md:items-stretch">
        <div
          className="relative h-[320px] overflow-hidden rounded-2xl border shadow-sm md:h-[420px]"
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
          <div className="pointer-events-none absolute bottom-3 left-3 z-[1000] flex items-center gap-2 rounded-full bg-background/90 px-3 py-1.5 text-xs font-semibold shadow-sm backdrop-blur">
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

        <PinInfoPanel
          pin={currentPin}
          index={currentIndex}
          total={total}
          imageUrl={currentImageUrl}
          fileName={currentPhoto?.fileName}
          onPhotoClick={openLightbox}
          onReplacePhoto={onReplacePhoto}
        />
      </div>

      <RoutePhotoGallery
        pins={pins}
        index={currentIndex}
        imageUrl={currentImageUrl}
        fileName={currentPhoto?.fileName}
        onPrev={goPrev}
        onNext={goNext}
        onSelect={setCurrentIndex}
        onPhotoClick={openLightbox}
        onReplacePhoto={onReplacePhoto}
      />

      <PhotoDialog
        photos={lightboxPhotos}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onReplacePhoto={onReplacePhoto}
      />
    </div>
  );
}
