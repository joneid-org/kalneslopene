import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatSecondsToTime, mapResultTimeToNumber } from "@/lib/TimeUtils.ts";
import type { OrganizerDTO, RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

function extractYear(raceDate: unknown): number {
  if (Array.isArray(raceDate)) return (raceDate as number[])[0];
  if (raceDate instanceof Date) return raceDate.getFullYear();
  return Number(String(raceDate).split("-")[0]);
}

function raceDateToSortKey(raceDate: unknown): string {
  if (Array.isArray(raceDate)) {
    const [y, mo, d, h = 0, mi = 0] = raceDate as number[];
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }
  if (raceDate instanceof Date) return raceDate.toISOString();
  return String(raceDate);
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  const now = new Date().toISOString();
  return Array.from(
    new Set(
      races
        .filter((race) => raceDateToSortKey(race.raceDate) <= now)
        .map((race) => extractYear(race.raceDate)),
    ),
  ).sort((a, b) => b - a);
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
  return (
    races
      .filter((race) => raceDateToSortKey(race.raceDate) < currentKey)
      .sort((a, b) =>
        raceDateToSortKey(b.raceDate).localeCompare(
          raceDateToSortKey(a.raceDate),
        ),
      )[0] ?? null
  );
}

export function getNextRace(races: RaceDTO[], uuid?: string): RaceDTO | null {
  const now = new Date().toISOString();
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  const currentKey = raceDateToSortKey(currentRace.raceDate);
  return (
    races
      .filter(
        (race) =>
          raceDateToSortKey(race.raceDate) > currentKey &&
          raceDateToSortKey(race.raceDate) <= now,
      )
      .sort((a, b) =>
        raceDateToSortKey(a.raceDate).localeCompare(
          raceDateToSortKey(b.raceDate),
        ),
      )[0] ?? null
  );
}

export function findFastetFemaleInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return results
    .filter((r) => r.runner.gender === "Kvinne" && r.resultTime)
    .sort(
      (a, b) =>
        mapResultTimeToNumber(a.resultTime ?? "") -
        mapResultTimeToNumber(b.resultTime ?? ""),
    )[0];
}

export function findFastetMaleInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return results
    .filter((r) => r.runner.gender === "Mann" && r.resultTime)
    .sort(
      (a, b) =>
        mapResultTimeToNumber(a.resultTime ?? "") -
        mapResultTimeToNumber(b.resultTime ?? ""),
    )[0];
}

export function findFastestRunnerInRace(
  results: RaceRunnerDTO[],
): RaceRunnerDTO | undefined {
  return results
    .filter((r) => r.resultTime)
    .sort(
      (a, b) =>
        mapResultTimeToNumber(a.resultTime ?? "") -
        mapResultTimeToNumber(b.resultTime ?? ""),
    )[0];
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
};

export function buildTableRows(
  raceRunners: RaceRunnerDTO[],
  raceCountByRunner: Record<string, number> = {},
  allRacesByRunner: Record<string, RaceRunnerDTO[]> = {},
): RowData[] {
  const sorted = [...raceRunners].sort(
    (a, b) =>
      mapResultTimeToNumber(a.resultTime ?? "") -
      mapResultTimeToNumber(b.resultTime ?? ""),
  );

  const currentYear = new Date().getFullYear();

  return sorted.map((rr, index) => {
    const timeSeconds = mapResultTimeToNumber(rr.resultTime ?? "");
    const paceSeconds =
      DISTANCE_KM > 0 && timeSeconds > 0
        ? timeSeconds / DISTANCE_KM
        : Number.NaN;
    const runnerHistory = allRacesByRunner[rr.runner.uuid ?? ""] ?? [];
    return {
      position: index + 1,
      runnerName: rr.runner.name,
      gender: rr.runner.gender,
      time: rr.hideTime ? "Deltatt" : formatSecondsToTime(timeSeconds),
      hideTime: rr.hideTime,
      pace: formatSecondsToTime(paceSeconds),
      races: raceCountByRunner[rr.runner.uuid ?? ""] ?? 0,
      pr: getBestRaceFromRunner(runnerHistory),
      yearBest: getBestRaceThisYearFromRunner(runnerHistory, currentYear),
    };
  });
}

export function getBestRaceFromRunner(raceRunner: RaceRunnerDTO[]): string {
  const best = raceRunner
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

export function getBestRaceThisYearFromRunner(
  raceRunner: RaceRunnerDTO[],
  year: number,
): string {
  const best = raceRunner
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
