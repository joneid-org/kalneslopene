import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Eye,
  Sun,
  SunDim,
} from "lucide-react";

/** Maps a Yr symbol_code to a human-readable Norwegian label. */
const SYMBOL_LABELS: Record<string, string> = {
  clearsky: "Klarvær",
  fair: "Lettskyet",
  partlycloudy: "Delvis skyet",
  cloudy: "Overskyet",
  rainshowers: "Regnbyger",
  rain: "Regn",
  heavyrain: "Kraftig regn",
  lightrain: "Lett regn",
  sleet: "Sludd",
  snow: "Snø",
  snowshowers: "Snøbyger",
  fog: "Tåke",
  thunder: "Torden",
};

/** Strips the `_day` / `_night` suffix that Yr appends to some symbol codes. */
function baseSymbol(symbol: string): string {
  return symbol.replace(/_day|_night/, "");
}

export function weatherLabel(symbol: string): string {
  return SYMBOL_LABELS[baseSymbol(symbol)] ?? SYMBOL_LABELS[symbol] ?? symbol;
}

/** Selectable weather conditions for manual admin entry (label ↔ Yr symbol_code). */
export const WEATHER_SYMBOL_OPTIONS: { value: string; label: string }[] =
  Object.entries(SYMBOL_LABELS).map(([value, label]) => ({ value, label }));

export function weatherIcon(symbol: string): LucideIcon {
  const s = baseSymbol(symbol);
  if (s === "clearsky") return Sun;
  if (s === "fair") return SunDim;
  if (s === "partlycloudy") return SunDim;
  if (s === "cloudy") return Cloud;
  if (s === "fog") return Eye;
  if (s.includes("thunder")) return CloudLightning;
  if (s.includes("snow")) return CloudSnow;
  if (s.includes("sleet")) return CloudDrizzle;
  if (s.includes("rain")) return CloudRain;
  return Cloud;
}
