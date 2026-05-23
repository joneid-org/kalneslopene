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

// Antall lpere som satte personlig rekord i et gitt lp
export function getNewPersonalBestCount(
  raceRunners: RaceRunnerDTO[],
  raceUuid: string,
  allRacesByRunner: Record<string, RaceRunnerDTO[]>,
): number {
  return raceRunners.filter((rr) => {
    if (rr.hideTime || !rr.resultTime) return false;
    const currentSeconds = mapResultTimeToNumber(rr.resultTime);
    if (currentSeconds <= 0) return false;
    const history = (allRacesByRunner[rr.runner.uuid ?? ""] ?? []).filter(
      (h) => !h.hideTime && h.resultTime && h.race.uuid !== raceUuid,
    );
    if (history.length === 0) return true;
    const previousBest = Math.min(
      ...history.map((h) => mapResultTimeToNumber(h.resultTime)),
    );
    return currentSeconds < previousBest;
  }).length;
}

// Antall lpere som satte rsbeste i et gitt lp
export function getNewYearBestCount(
  raceRunners: RaceRunnerDTO[],
  raceUuid: string,
  allRacesByRunner: Record<string, RaceRunnerDTO[]>,
): number {
  const year = new Date().getFullYear();
  return raceRunners.filter((rr) => {
    if (rr.hideTime || !rr.resultTime) return false;
    const currentSeconds = mapResultTimeToNumber(rr.resultTime);
    if (currentSeconds <= 0) return false;
    const history = (allRacesByRunner[rr.runner.uuid ?? ""] ?? []).filter(
      (h) =>
        !h.hideTime &&
        h.resultTime &&
        h.race.uuid !== raceUuid &&
        extractYear(h.race.raceDate) === year,
    );
    if (history.length === 0) return true;
    const previousBest = Math.min(
      ...history.map((h) => mapResultTimeToNumber(h.resultTime)),
    );
    return currentSeconds < previousBest;
  }).length;
}
