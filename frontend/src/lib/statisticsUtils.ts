import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export type PersonalRecord = {
  runnerUuid: string;
  runnerName: string;
  gender: string;
  pr: string;
  prSeconds: number;
  totalRaces: number;
};

export function getPersonalRecords(
  allRacesByRunner: Record<string, RaceRunnerDTO[]>,
): PersonalRecord[] {
  return Object.entries(allRacesByRunner)
    .map(([uuid, races]) => {
      if (races.length === 0) return null;
      const { name, gender } = races[0].runner;
      const best = races
        .filter((rr) => !rr.hideTime && rr.resultTime)
        .sort(
          (a, b) =>
            mapResultTimeToNumber(a.resultTime) -
            mapResultTimeToNumber(b.resultTime),
        )[0];
      const prSeconds = best ? mapResultTimeToNumber(best.resultTime) : 0;
      return {
        runnerUuid: uuid,
        runnerName: name,
        gender,
        pr: best ? formatSecondsToTime(prSeconds) : "-",
        prSeconds,
        totalRaces: races.length,
      };
    })
    .filter((r): r is PersonalRecord => r !== null && r.prSeconds > 0)
    .sort((a, b) => a.prSeconds - b.prSeconds);
}

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

// Raskeste løper (returnerer full RaceRunnerDTO)
export function getFastestRunner(
  raceRunners: RaceRunnerDTO[],
): RaceRunnerDTO | null {
  return (
    raceRunners
      .filter((rr) => !rr.hideTime && rr.resultTime)
      .sort(
        (a, b) =>
          mapResultTimeToNumber(a.resultTime) -
          mapResultTimeToNumber(b.resultTime),
      )[0] ?? null
  );
}

// Løyperekord (fastest time ever)
export function getCourseRecord(raceRunners: RaceRunnerDTO[]): string {
  const best = getFastestRunner(raceRunners);
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

// Antall løp gjennomført dette året (frem til og med i dag)
export function getRacesHeldThisYear(races: RaceDTO[], year: number): number {
  const now = new Date().toISOString();
  return races.filter(
    (r) =>
      extractYear(r.raceDate) === year && raceDateToSortKey(r.raceDate) <= now,
  ).length;
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

// Antall gjenstende lp dette ret (etter i dag)
export function getRacesLeftThisYear(races: RaceDTO[], year: number): number {
  const now = new Date().toISOString();
  return races.filter(
    (r) =>
      extractYear(r.raceDate) === year && raceDateToSortKey(r.raceDate) > now,
  ).length;
}

// Antall unike løpere av et gitt kjønn dette året
export function getUniqueRunnersByGenderThisYear(
  raceRunners: RaceRunnerDTO[],
  year: number,
  gender: string,
): number {
  return new Set(
    raceRunners
      .filter(
        (r) =>
          extractYear(r.race.raceDate) === year &&
          r.runner.gender?.toLowerCase() === gender.toLowerCase(),
      )
      .map((r) => r.runner.uuid),
  ).size;
}
