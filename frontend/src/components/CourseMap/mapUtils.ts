import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix default marker icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

export function colorIcon(color: string, active = false) {
  const size = active ? 21 : 15;
  const box = size + 1;
  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;
      background:${color};border:${active ? 3 : 2}px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,.4);
      transform:rotate(-45deg);
    "></div>`,
    iconSize: [box, box],
    iconAnchor: [box / 2, box],
    popupAnchor: [0, -(box + 2)],
  });
}
