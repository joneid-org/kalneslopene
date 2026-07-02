import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

// Raskeste løper (returnerer full RaceRunnerDTO)
export function getFastestRunner(
  raceRunners: RaceRunnerDTO[],
): RaceRunnerDTO | null {
  let best: RaceRunnerDTO | null = null;
  let bestSeconds = Number.POSITIVE_INFINITY;
  for (const rr of raceRunners) {
    if (rr.hideTime || !rr.resultTime) continue;
    const seconds = mapResultTimeToNumber(rr.resultTime);
    if (seconds < bestSeconds) {
      bestSeconds = seconds;
      best = rr;
    }
  }
  return best;
}

// Årets beste tid
export function getBestTimeThisYear(
  raceRunners: RaceRunnerDTO[],
  year: number,
): string {
  let bestSeconds = Number.POSITIVE_INFINITY;
  for (const rr of raceRunners) {
    if (rr.hideTime || !rr.resultTime) continue;
    if (extractYear(rr.race.raceDate) !== year) continue;
    const seconds = mapResultTimeToNumber(rr.resultTime);
    if (seconds < bestSeconds) bestSeconds = seconds;
  }
  return Number.isFinite(bestSeconds) ? formatSecondsToTime(bestSeconds) : "-";
}
