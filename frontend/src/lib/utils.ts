import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DISTANCE_KM } from "@/lib/constants.ts";
import {
  type DatedRaceRunner,
  getBestTimeThisYear,
  getFastestRunner,
} from "@/lib/statisticsUtils.ts";
import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { OrganizerDTO, RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  const now = new Date().toISOString();
  const years = new Set<number>();
  for (const race of races) {
    if (raceDateToSortKey(race.raceDate) <= now) {
      years.add(extractYear(race.raceDate));
    }
  }
  return Array.from(years).toSorted((a, b) => b - a);
}

export function getRacesDTOByYear(races: RaceDTO[], year: number): RaceDTO[] {
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
  races: RaceDTO[],
  uuid?: string,
): RaceDTO | null {
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = raceDateToSortKey(currentRace.raceDate);
  let best: RaceDTO | null = null;
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

export function getMostRecentRace(races: RaceDTO[]): RaceDTO | null {
  const now = new Date().toISOString();
  let best: RaceDTO | null = null;
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

export function getNextRace(races: RaceDTO[], uuid?: string): RaceDTO | null {
  const now = new Date().toISOString();
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = raceDateToSortKey(currentRace.raceDate);
  let best: RaceDTO | null = null;
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
  position: number;
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

  return sorted.map((runner, index) => {
    const timeSeconds = mapResultTimeToNumber(runner.resultTime ?? "");
    const paceSeconds =
      DISTANCE_KM > 0 && timeSeconds > 0
        ? timeSeconds / DISTANCE_KM
        : Number.NaN;
    const previousPr = mapResultTimeToNumber(runner.previousPersonalRecord);
    const hasVisibleTime = !runner.hideTime && timeSeconds > 0;
    const isPR =
      hasVisibleTime &&
      (!Number.isFinite(previousPr) || timeSeconds < previousPr);
    return {
      position: index + 1,
      runnerName: runner.runner.name,
      gender: runner.runner.gender,
      time: runner.hideTime ? "Deltatt" : formatSecondsToTime(timeSeconds),
      hideTime: runner.hideTime,
      pace: formatSecondsToTime(paceSeconds),
      races: runner.seasonRaces,
      pr: formatSecondsToTime(isPR ? timeSeconds : previousPr),
      yearBest: formatSecondsToTime(
        mapResultTimeToNumber(runner.previousSeasonBest),
      ),
      isPR,
    };
  });
}

export function getBestRaceFromRunner(raceRunner: RaceRunnerDTO[]): string {
  const best = getFastestRunner(raceRunner);
  return best
    ? formatSecondsToTime(mapResultTimeToNumber(best.resultTime))
    : "-";
}

export function getBestRaceThisYearFromRunner(
  raceRunner: DatedRaceRunner[],
  year: number,
): string {
  return getBestTimeThisYear(raceRunner, year);
}

export function isPast(race: RaceDTO): boolean {
  return raceDateToSortKey(race.raceDate) < new Date().toISOString();
}

export function getUpcomingRaces(races: RaceDTO[]): RaceDTO[] {
  const now = new Date().toISOString();
  return races
    .filter((r) => raceDateToSortKey(r.raceDate) >= now)
    .sort((a, b) =>
      raceDateToSortKey(a.raceDate).localeCompare(
        raceDateToSortKey(b.raceDate),
      ),
    );
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
