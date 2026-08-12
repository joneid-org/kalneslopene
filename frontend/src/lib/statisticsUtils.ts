import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type TimedResult = {
  resultTime: string | null;
  hideTime?: boolean;
};

export function getFastestRunner<T extends TimedResult>(
  raceRunners: T[],
): T | null {
  let best: T | null = null;
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

export function getPersonalRecord(
  raceHistory: RaceRunnerDTO[],
  historicPersonalRecord?: string,
): string {
  const fastest = getFastestRunner(raceHistory);
  const candidates = [
    mapResultTimeToNumber(fastest?.resultTime),
    mapResultTimeToNumber(historicPersonalRecord),
  ].filter((seconds) => Number.isFinite(seconds) && seconds > 0);
  return candidates.length > 0
    ? formatSecondsToTime(Math.min(...candidates))
    : "-";
}

export function getBestTimeThisYear(
  raceRunners: RaceRunnerDTO[],
  year: number,
): string {
  let bestSeconds = Number.POSITIVE_INFINITY;
  for (const rr of raceRunners) {
    if (rr.hideTime || !rr.resultTime) continue;
    if (extractYear(rr.raceInfo.raceDate) !== year) continue;
    const seconds = mapResultTimeToNumber(rr.resultTime);
    if (seconds < bestSeconds) bestSeconds = seconds;
  }
  return Number.isFinite(bestSeconds) ? formatSecondsToTime(bestSeconds) : "-";
}
