import { mapResultTimeToNumber } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO, WeatherDto } from "@/model/DTO.ts";

/** String-backed mirror of WeatherDto for the admin weather inputs. */
export type WeatherForm = {
  symbol: string;
  temperature: string;
  windSpeed: string;
  precipitation: string;
};

export function weatherToForm(weather?: WeatherDto): WeatherForm {
  return {
    symbol: weather?.symbol ?? "",
    temperature: weather?.temperature?.toString() ?? "",
    windSpeed: weather?.windSpeed?.toString() ?? "",
    precipitation: weather?.precipitation?.toString() ?? "",
  };
}

/** Full WeatherDto when every field is valid, else undefined (leaves stored weather untouched). */
export function formToWeather(form: WeatherForm): WeatherDto | undefined {
  const temperature = Number.parseFloat(form.temperature);
  const windSpeed = Number.parseFloat(form.windSpeed);
  const precipitation = Number.parseFloat(form.precipitation);
  if (
    !form.symbol ||
    Number.isNaN(temperature) ||
    Number.isNaN(windSpeed) ||
    Number.isNaN(precipitation)
  )
    return undefined;
  return { symbol: form.symbol, temperature, windSpeed, precipitation };
}

export function genderLabel(gender: string): string {
  const g = gender.toUpperCase();
  if (g === "MALE") return "Mann";
  if (g === "FEMALE") return "Kvinne";
  return gender;
}

/** Seconds parsed from a RaceRunnerDTO's ISO duration, or null when no time. */
export function entrySeconds(entry: RaceRunnerDTO): number | null {
  const seconds = mapResultTimeToNumber(entry.resultTime);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function entryHasTime(entry: RaceRunnerDTO): boolean {
  return entry.hideTime || entrySeconds(entry) != null;
}
