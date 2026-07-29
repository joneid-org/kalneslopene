import type { LucideIcon } from "lucide-react";
import {
  Cloud,
  CloudDrizzle,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Compass,
  Droplets,
  Eye,
  Sun,
  SunDim,
  Thermometer,
  Wind,
} from "lucide-react";
import type { WeatherDto } from "@/model/DTO.ts";

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

/** 8-point Norwegian compass labels, indexed by 45° sector starting at N. */
const WIND_DIRECTIONS = ["N", "NØ", "Ø", "SØ", "S", "SV", "V", "NV"];

const WIND_SECTOR_DEGREES = 45;

/** Snaps a wind bearing in degrees to the nearest 8-point sector index (0–7). */
function windDirectionSectorIndex(degrees: number): number {
  return Math.round(degrees / WIND_SECTOR_DEGREES) % WIND_DIRECTIONS.length;
}

/** Converts a wind bearing in degrees (0–360) to an 8-point Norwegian compass label. */
export function windDirectionLabel(degrees: number): string {
  return WIND_DIRECTIONS[windDirectionSectorIndex(degrees)];
}

/** Snaps a wind bearing to the canonical degrees of its nearest 8-point sector. */
export function windDirectionSector(degrees: number): number {
  return windDirectionSectorIndex(degrees) * WIND_SECTOR_DEGREES;
}

/** Selectable wind directions for manual admin entry (canonical degrees ↔ label). */
export const WIND_DIRECTION_OPTIONS: { value: number; label: string }[] =
  WIND_DIRECTIONS.map((label, i) => ({
    value: i * WIND_SECTOR_DEGREES,
    label,
  }));

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

/**
 * Icon + display text for each weather field that has a value, undefined otherwise.
 * The single source for which fields render and how; consumers own layout and styling.
 */
export function weatherItems(weather: WeatherDto = {}) {
  const { symbol, temperature, windSpeed, windDirection, precipitation } =
    weather;
  return {
    symbol: symbol
      ? { icon: weatherIcon(symbol), text: weatherLabel(symbol) }
      : undefined,
    temperature:
      temperature != null
        ? { icon: Thermometer, text: `${temperature}°C` }
        : undefined,
    windSpeed:
      windSpeed != null ? { icon: Wind, text: `${windSpeed} m/s` } : undefined,
    windDirection:
      windDirection != null
        ? { icon: Compass, text: windDirectionLabel(windDirection) }
        : undefined,
    precipitation:
      precipitation != null && precipitation > 0
        ? { icon: Droplets, text: `${precipitation} mm` }
        : undefined,
  };
}
