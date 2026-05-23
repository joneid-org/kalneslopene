import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import type { YrTimeseries } from "@/model/DTO.ts";

/** Maps Yr symbol_code to a human-readable Norwegian label */
const SYMBOL_LABELS: Record<string, string> = {
  clearsky_day: "Klarvær",
  clearsky_night: "Klarvær",
  fair_day: "Lettskyet",
  fair_night: "Lettskyet",
  partlycloudy_day: "Delvis skyet",
  partlycloudy_night: "Delvis skyet",
  cloudy: "Overskyet",
  rainshowers_day: "Regnbyger",
  rainshowers_night: "Regnbyger",
  rain: "Regn",
  heavyrain: "Kraftig regn",
  lightrain: "Lett regn",
  sleet: "Sludd",
  snow: "Snø",
  snowshowers_day: "Snøbyger",
  snowshowers_night: "Snøbyger",
  fog: "Tåke",
  thunder: "Torden",
};

export type YrWeatherResult = {
  temperature: number;
  symbol: string;
  label: string;
  precipitation: number;
  windSpeed: number;
};

const OSLO_FORMATTER = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Oslo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/**
 * Finds the Yr forecast timeseries entry closest to the given race date/hour.
 * raceDate is treated as a local Norway/Oslo time and converted to UTC for comparison.
 * Yr timeseries entries are in UTC.
 */
export function useYrWeather(
  raceDate: string | undefined,
): YrWeatherResult | undefined {
  const { data: forecast } = useQuery(QUERIES.yr.getForecast);

  if (!forecast || !raceDate) return undefined;

  // Parse the race date as Norway/Oslo local time → get UTC ms
  // We use Intl to figure out the UTC offset for Europe/Oslo at the race time.
  const raceDateObj = new Date(raceDate);

  // Get the UTC offset for Europe/Oslo at raceDateObj (handles DST automatically)
  const parts = OSLO_FORMATTER.formatToParts(raceDateObj);
  const get = (type: string) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  // Reconstruct the local Oslo wall-clock time that corresponds to raceDateObj
  const osloLocalMs = Date.UTC(
    get("year"),
    get("month") - 1,
    get("day"),
    get("hour"),
    get("minute"),
    get("second"),
  );
  // Offset in ms: positive means Oslo is ahead of UTC
  const offsetMs = osloLocalMs - raceDateObj.getTime();

  // Race time in UTC (strip minutes/seconds, round to hour)
  const raceUTC = new Date(raceDateObj.getTime() - offsetMs);
  raceUTC.setUTCMinutes(0, 0, 0);

  const timeseries = forecast.properties.timeseries;

  // Find exact or closest entry
  let best: YrTimeseries | undefined;
  let bestDiff = Number.POSITIVE_INFINITY;

  for (const entry of timeseries) {
    const entryTime = new Date(entry.time);
    const diff = Math.abs(entryTime.getTime() - raceUTC.getTime());
    if (diff < bestDiff) {
      bestDiff = diff;
      best = entry;
    }
  }

  if (!best) return undefined;

  const symbol =
    best.data.next_1_hours?.summary.symbol_code ??
    best.data.next_6_hours?.summary.symbol_code ??
    "cloudy";

  const precipitation =
    best.data.next_1_hours?.details.precipitation_amount ??
    best.data.next_6_hours?.details.precipitation_amount ??
    0;

  return {
    temperature: Math.round(best.data.instant.details.air_temperature),
    windSpeed: Math.round(best.data.instant.details.wind_speed * 10) / 10,
    symbol,
    label:
      SYMBOL_LABELS[symbol.replace(/_day|_night/, "")] ??
      SYMBOL_LABELS[symbol] ??
      symbol,
    precipitation,
  };
}
