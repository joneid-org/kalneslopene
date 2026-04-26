import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
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
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { blaaRoute } from "@/data/coordinater";
import {
  categoryLabel,
  categoryVariant,
  MAP_CENTER,
  MAP_ZOOM,
  mapLegend,
  type Pin,
  pins,
  routePhotos,
} from "@/data/loypekartData.ts"; // Fix default marker icon paths broken by bundlers

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
      width:15px;height:15px;border-radius:50% 50% 50% 0;
      background:${color};border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.4);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [16, 16],
    iconAnchor: [8, 16],
    popupAnchor: [0, -18],
  });
}

export function Loypekart() {
  const [activePin, setActivePin] = useState<Pin | null>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const photo = routePhotos[photoIndex];
  const total = routePhotos.length;

  function prev() {
    setPhotoIndex((i) => (i - 1 + total) % total);
  }
  function next() {
    setPhotoIndex((i) => (i + 1) % total);
  }

  return (
    <div className="w-full max-w-[80vw] mx-auto px-4 py-8 space-y-6">
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
        <div
          className="flex-1 rounded-xl overflow-hidden border shadow-sm min-h-105"
          style={{ zIndex: 0 }}
        >
          {" "}
          <MapContainer
            center={MAP_CENTER}
            zoom={MAP_ZOOM}
            style={{ height: "100%", minHeight: "420px", width: "100%" }}
            scrollWheelZoom={false}
          >
            <TileLayer
              // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Routes */}
            <Polyline
              positions={blaaRoute}
              pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.8 }}
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
                <p className="text-secondary">{activePin.description}</p>
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

      {/* Photo gallery */}
      <Separator />

      <div className="space-y-3">
        <h2 className="text-xl font-semibold tracking-tight">
          Løypa 200 for 200
        </h2>
        <p className="text-sm text-muted-foreground">
          Naviger gjennom bildene for å se steder langs ruten.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Text side */}
        <div className="flex-1 flex flex-col justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground tabular-nums">
                {photoIndex + 1} / {total}
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight">{photo.title}</h3>
            <p className="text-muted-foreground leading-relaxed">
              {photo.caption}
            </p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prev}
              aria-label="Forrige bilde"
            >
              <ChevronLeftIcon className="size-4" />
            </Button>
            <div className="flex gap-1.5">
              {routePhotos.map((_, i) => (
                <button
                  key={routePhotos[i].id}
                  type="button"
                  onClick={() => setPhotoIndex(i)}
                  aria-label={`Gå til bilde ${i + 1}`}
                  className={`rounded-full transition-all ${
                    i === photoIndex
                      ? "w-4 h-2 bg-primary"
                      : "w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={next}
              aria-label="Neste bilde"
            >
              <ChevronRightIcon className="size-4" />
            </Button>
          </div>
        </div>

        {/* Image side */}
        <div className="md:w-1/2 shrink-0">
          <button
            type="button"
            className="w-full group relative overflow-hidden rounded-xl border shadow-sm aspect-video bg-muted block cursor-zoom-in"
            onClick={() => setLightboxOpen(true)}
            aria-label="Åpne bilde i fullskjerm"
          >
            <img
              key={photo.id}
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/50 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                Klikk for å forstørre
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/90" />
          <DialogContent className="max-w-none w-screen h-screen p-0 border-0 bg-transparent shadow-none flex items-center justify-center gap-0 [&>button]:hidden">
            {/* Close */}
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 z-50 text-white hover:bg-white/20 hover:text-white"
                aria-label="Lukk"
              >
                <XIcon className="size-5" />
              </Button>
            </DialogClose>

            {/* Prev */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Forrige bilde"
            >
              <ChevronLeftIcon className="size-6" />
            </Button>

            {/* Image + caption */}
            <div className="flex flex-col items-center gap-4 px-16 max-w-5xl w-full">
              <img
                key={photo.id}
                src={photo.imageUrl}
                alt={photo.title}
                className="max-h-[80vh] max-w-full rounded-lg object-contain shadow-2xl"
              />
              <div className="text-center space-y-1">
                <p className="text-white font-semibold text-lg">
                  {photo.title}
                </p>
                <p className="text-white/70 text-sm max-w-xl">
                  {photo.caption}
                </p>
                <p className="text-white/40 text-xs tabular-nums">
                  {photoIndex + 1} / {total}
                </p>
              </div>
            </div>

            {/* Next */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 text-white hover:bg-white/20 hover:text-white"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Neste bilde"
            >
              <ChevronRightIcon className="size-6" />
            </Button>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
