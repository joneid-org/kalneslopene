import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Photo } from "@/data/mockdata.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import {
  getBestTimeThisYear,
  getFastestRunner,
} from "@/lib/statisticsUtils.ts";
import { convertSecondsToTime, getYear } from "@/lib/timeUtils.ts";
import type { OrganizerDTO, RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function getPhotosByRaceId(
  photos: Photo[],
  uuid: string | undefined,
): Photo[] {
  if (!uuid) return [];
  return photos.filter((p) => p.raceId === uuid);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  const now = new Date().toISOString();
  return Array.from(
    new Set(
      races
        .filter((race) => race.raceDate <= now)
        .map((race) => getYear(race.raceDate)),
    ),
  ).sort((a, b) => b - a);
}

export function getRacesDTOByYear(races: RaceDTO[], year: number): RaceDTO[] {
  const now = new Date().toISOString();
  return races
    .filter((race) => getYear(race.raceDate) === year && race.raceDate <= now)
    .sort((a, b) => b.raceDate.localeCompare(a.raceDate));
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
  const currentKey = currentRace.raceDate;
  return (
    races
      .filter((race) => race.raceDate < currentKey)
      .sort((a, b) => b.raceDate.localeCompare(a.raceDate))[0] ?? null
  );
}

export function getNextRace(races: RaceDTO[], uuid?: string): RaceDTO | null {
  const now = new Date().toISOString();
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = currentRace.raceDate;
  return (
    races
      .filter((race) => race.raceDate > currentKey && race.raceDate <= now)
      .sort((a, b) => a.raceDate.localeCompare(b.raceDate))[0] ?? null
  );
}

export function findFastetFemaleInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return findFastestInRace(results, "Kvinne");
}

export function findFastetMaleInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return findFastestInRace(results, "Mann");
}

export function findFastestRunnerInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return findFastestInRace(results);
}

export function findFastestInRace(
  results: RaceRunnerDTO[],
  gender?: string,
): RaceRunnerDTO | undefined {
  return results
    .filter((r) => r.resultTime && (!gender || r.runner.gender === gender))
    .sort((a, b) => a.resultTime - b.resultTime)[0];
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

export function buildTableRows(
  raceRunners: RaceRunnerDTO[],
  raceCountByRunner: Record<string, number> = {},
  allRacesByRunner: Record<string, RaceRunnerDTO[]> = {},
): RowData[] {
  const sorted = [...raceRunners].sort((a, b) => a.resultTime - b.resultTime);

  const currentYear = new Date().getFullYear();

  return sorted.map((rr, index) => {
    const timeSeconds = rr.resultTime;
    const paceSeconds =
      DISTANCE_KM > 0 && timeSeconds > 0
        ? timeSeconds / DISTANCE_KM
        : Number.NaN;
    const runnerHistory = allRacesByRunner[rr.runner.uuid ?? ""] ?? [];
    const prTime = getBestRaceFromRunner(runnerHistory);
    const formattedTime = rr.hideTime
      ? "Deltatt"
      : convertSecondsToTime(timeSeconds);
    return {
      position: index + 1,
      runnerName: rr.runner.name,
      gender: rr.runner.gender,
      time: formattedTime,
      hideTime: rr.hideTime,
      pace: convertSecondsToTime(paceSeconds),
      races: raceCountByRunner[rr.runner.uuid ?? ""] ?? 0,
      pr: prTime,
      yearBest: getBestRaceThisYearFromRunner(runnerHistory, currentYear),
      isPR: !rr.hideTime && timeSeconds > 0 && formattedTime === prTime,
    };
  });
}

export function getBestRaceFromRunner(raceRunner: RaceRunnerDTO[]): string {
  const best = getFastestRunner(raceRunner);
  return best ? convertSecondsToTime(best.resultTime) : "-";
}

export function getBestRaceThisYearFromRunner(
  raceRunner: RaceRunnerDTO[],
  year: number,
): string {
  return getBestTimeThisYear(raceRunner, year);
}

export function isPast(race: RaceDTO): boolean {
  return race.raceDate < new Date().toISOString();
}

export function getUpcomingRaces(races: RaceDTO[]): RaceDTO[] {
  const now = new Date().toISOString();
  return races
    .filter((r) => r.raceDate >= now)
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate));
}

export function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
