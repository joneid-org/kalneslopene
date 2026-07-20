import { mapResultTimeToNumber } from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

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
