import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

// Totalt antall løp
export function getNumberOfRaces(races: RaceDTO[]): number {
  return races.length;
}

// Totalt antall løp basert på år
export function getNumberOfRacesThisYear(
  races: RaceDTO[],
  year: number,
): number {
  return races.filter((r) => extractYear(r.raceDate) === year).length;
}

// Totalt antall unike løpere
export function getNumberOfUniqueRunners(raceRunners: RaceRunnerDTO[]): number {
  return new Set(raceRunners.map((rr) => rr.runner.uuid)).size;
}
export function getNumberOfUniqueRunnersThisYear(
  raceRunners: RaceRunnerDTO[],
  year: number,
): number {
  return new Set(
    raceRunners
      .filter((rr) => extractYear(rr.race.raceDate) === year)
      .map((rr) => rr.runner.uuid),
  ).size;
}

// Antall deltakere på det løpet med flest løpere
export function getMaxParticipantsInSingleRace(
  raceRunners: RaceRunnerDTO[],
): number {
  const countsByRace = raceRunners.reduce<Record<string, number>>((acc, rr) => {
    const uuid = rr.race.uuid ?? "";
    acc[uuid] = (acc[uuid] ?? 0) + 1;
    return acc;
  }, {});
  return Math.max(0, ...Object.values(countsByRace));
}

// Løyperekord (fastest time ever)
export function getCourseRecord(raceRunners: RaceRunnerDTO[]): string {
  const best = raceRunners
    .filter((rr) => !rr.hideTime && rr.resultTime)
    .sort(
      (a, b) =>
        mapResultTimeToNumber(a.resultTime) -
        mapResultTimeToNumber(b.resultTime),
    )[0];
  return best
    ? formatSecondsToTime(mapResultTimeToNumber(best.resultTime))
    : "-";
}

// Årets beste tid
export function getBestTimeThisYear(
  raceRunners: RaceRunnerDTO[],
  year: number,
): string {
  const best = raceRunners
    .filter(
      (rr) =>
        !rr.hideTime && rr.resultTime && extractYear(rr.race.raceDate) === year,
    )
    .sort(
      (a, b) =>
        mapResultTimeToNumber(a.resultTime) -
        mapResultTimeToNumber(b.resultTime),
    )[0];
  return best
    ? formatSecondsToTime(mapResultTimeToNumber(best.resultTime))
    : "-";
}

// Gjennomsnittsdeltakelse (average participants per race)
export function getAverageParticipants(raceRunners: RaceRunnerDTO[]): number {
  const races = new Set(raceRunners.map((rr) => rr.race.uuid)).size;
  if (races === 0) return 0;
  return Math.round(raceRunners.length / races);
}
