import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { getBestTimeThisYear } from "@/lib/statisticsUtils.ts";
import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type {
  OrganizerDTO,
  RaceDTO,
  RaceInfoDTO,
  RaceRunnerDTO,
} from "@/model/DTO.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function genderLabel(gender: string): string {
  const g = gender.toUpperCase();
  if (g === "MALE") return "Mann";
  if (g === "FEMALE") return "Kvinne";
  return gender;
}

export function getYears(races: RaceDTO[]): number[];
export function getYears(races: RaceInfoDTO[]): number[];
export function getYears(races: RaceDTO[] | RaceInfoDTO[]): number[] {
  const now = new Date().toISOString();
  const years = new Set<number>();
  for (const race of races) {
    if (raceDateToSortKey(race.raceDate) <= now) {
      years.add(extractYear(race.raceDate));
    }
  }
  return Array.from(years).toSorted((a, b) => b - a);
}

export function getRacesDTOByYear(
  races: RaceInfoDTO[],
  year: number,
): RaceInfoDTO[];
export function getRacesDTOByYear(races: RaceDTO[], year: number): RaceDTO[];
export function getRacesDTOByYear(
  races: RaceDTO[] | RaceInfoDTO[],
  year: number,
): RaceDTO[] | RaceInfoDTO[] {
  const now = new Date().toISOString();
  return races
    .filter(
      (race) =>
        extractYear(race.raceDate) === year &&
        raceDateToSortKey(race.raceDate) <= now,
    )
    .sort((a, b) =>
      raceDateToSortKey(b.raceDate).localeCompare(
        raceDateToSortKey(a.raceDate),
      ),
    );
}

export function getContactPerson(
  organizers: OrganizerDTO[],
): OrganizerDTO | null {
  return organizers.find((organizer) => organizer.contactPerson) || null;
}

export function getPreviousRace(
  races: RaceInfoDTO[],
  uuid?: string,
): RaceInfoDTO | null;
export function getPreviousRace(
  races: RaceDTO[],
  uuid?: string,
): RaceDTO | null;
export function getPreviousRace(
  races: RaceDTO[] | RaceInfoDTO[],
  uuid?: string,
): RaceDTO | RaceInfoDTO | null {
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = raceDateToSortKey(currentRace.raceDate);
  let best: RaceDTO | RaceInfoDTO | null = null;
  let bestKey = "";
  for (const race of races) {
    const key = raceDateToSortKey(race.raceDate);
    if (key < currentKey && key > bestKey) {
      best = race;
      bestKey = key;
    }
  }
  return best;
}

export function getMostRecentRace(
  races: RaceInfoDTO[],
  uuid?: string,
): RaceInfoDTO | null;
export function getMostRecentRace(
  races: RaceDTO[],
  uuid?: string,
): RaceDTO | null;
export function getMostRecentRace(
  races: RaceDTO[] | RaceInfoDTO[],
): RaceDTO | RaceInfoDTO | null {
  const now = new Date().toISOString();
  let best: RaceDTO | RaceInfoDTO | null = null;
  let bestKey = "";
  for (const race of races) {
    const key = raceDateToSortKey(race.raceDate);
    if (key <= now && key > bestKey) {
      best = race;
      bestKey = key;
    }
  }
  return best;
}

export function getNextRace(
  races: RaceInfoDTO[],
  uuid?: string,
): RaceInfoDTO | null;
export function getNextRace(races: RaceDTO[], uuid?: string): RaceDTO | null;
export function getNextRace(
  races: RaceDTO[] | RaceInfoDTO[],
  uuid?: string,
): RaceDTO | RaceInfoDTO | null {
  const now = new Date().toISOString();
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = raceDateToSortKey(currentRace.raceDate);
  let best: RaceDTO | RaceInfoDTO | null = null;
  let bestKey = "";
  for (const race of races) {
    const key = raceDateToSortKey(race.raceDate);
    if (key <= currentKey || key > now) continue;
    if (best === null || key < bestKey) {
      best = race;
      bestKey = key;
    }
  }
  return best;
}

export type RowData = {
  uuid: string;
  position: number | null;
  runnerName: string;
  gender: string;
  time: string;
  hideTime: boolean;
  pace: string;
  races: number;
  pr: string;
  yearBest: string;
  isPR: boolean;
};

export function buildTableRows(runners: RaceRunnerDTO[]): RowData[] {
  const sorted = runners.toSorted((a, b) => {
    if (a.hideTime !== b.hideTime) return a.hideTime ? 1 : -1;
    return (
      mapResultTimeToNumber(a.resultTime ?? "") -
      mapResultTimeToNumber(b.resultTime ?? "")
    );
  });

  // Dense ranking: equal times share a position, and the next distinct time
  // continues without a gap (1, 2, 2, 3). "Deltatt" rows are sorted last and
  // get no position at all.
  let previousTime = Number.NaN;
  let previousPosition = 0;

  return sorted.map((runner) => {
    const timeSeconds = mapResultTimeToNumber(runner.resultTime ?? "");
    const paceSeconds =
      DISTANCE_KM > 0 && timeSeconds > 0
        ? timeSeconds / DISTANCE_KM
        : Number.NaN;
    const previousPr = mapResultTimeToNumber(runner.previousPersonalRecord);
    const previousSeasonBest = mapResultTimeToNumber(runner.previousSeasonBest);
    const hasVisibleTime = !runner.hideTime && timeSeconds > 0;
    const isPR =
      hasVisibleTime &&
      (!Number.isFinite(previousPr) || timeSeconds < previousPr);
    const isSeasonBest =
      hasVisibleTime &&
      (!Number.isFinite(previousSeasonBest) ||
        timeSeconds < previousSeasonBest);
    let position: number | null = null;
    if (!runner.hideTime) {
      position =
        timeSeconds === previousTime ? previousPosition : previousPosition + 1;
      previousTime = timeSeconds;
      previousPosition = position;
    }

    return {
      uuid: runner.runner.uuid,
      position,
      runnerName: runner.runner.name,
      gender: runner.runner.gender,
      time: runner.hideTime ? "Deltatt" : formatSecondsToTime(timeSeconds),
      hideTime: runner.hideTime,
      pace: formatSecondsToTime(paceSeconds),
      races: runner.seasonRaces,
      pr: formatSecondsToTime(isPR ? timeSeconds : previousPr),
      yearBest: formatSecondsToTime(
        isSeasonBest ? timeSeconds : previousSeasonBest,
      ),
      isPR,
    };
  });
}

export function getBestRaceFromRunner(raceRunner: RaceRunnerDTO[]): string {
  let latest: RaceRunnerDTO | null = null;
  let latestKey = "";
  for (const rr of raceRunner) {
    const key = raceDateToSortKey(rr.raceInfo.raceDate);
    if (key > latestKey) {
      latest = rr;
      latestKey = key;
    }
  }
  if (!latest) return "-";
  return formatSecondsToTime(
    mapResultTimeToNumber(latest.previousPersonalRecord),
  );
}

export function getBestRaceThisYearFromRunner(
  raceRunner: RaceRunnerDTO[],
  year: number,
): string {
  return getBestTimeThisYear(raceRunner, year);
}

export function isPast(race: RaceInfoDTO): boolean {
  return raceDateToSortKey(race.raceDate) < new Date().toISOString();
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
