import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

// RaceRunnerDTO carries only raceUuid, so resolve the race date from the race list
export type DatedRaceRunner = RaceRunnerDTO & { raceDate: string };

export function withRaceDates(
  raceRunners: RaceRunnerDTO[],
  races: RaceDTO[],
): DatedRaceRunner[] {
  const dateByUuid = new Map(races.map((race) => [race.uuid, race.raceDate]));
  return raceRunners.flatMap((rr) => {
    const raceDate = dateByUuid.get(rr.raceUuid);
    return raceDate ? [{ ...rr, raceDate }] : [];
  });
}

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
  raceRunners: DatedRaceRunner[],
  year: number,
): string {
  let bestSeconds = Number.POSITIVE_INFINITY;
  for (const rr of raceRunners) {
    if (rr.hideTime || !rr.resultTime) continue;
    if (extractYear(rr.raceDate) !== year) continue;
    const seconds = mapResultTimeToNumber(rr.resultTime);
    if (seconds < bestSeconds) bestSeconds = seconds;
  }
  return Number.isFinite(bestSeconds) ? formatSecondsToTime(bestSeconds) : "-";
}
