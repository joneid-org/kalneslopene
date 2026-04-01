import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DISTANCE_KM, NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";
import type { OrganizerDTO, RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  return Array.from(
    new Set(races.map((race) => race.raceDate.getFullYear())),
  ).sort((a, b) => b - a);
}

export function formatDDMonth(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = NORWEGIAN_MONTH_NAMES[date.getMonth()];
  return `${day}. ${month}`;
}

export function getRacesDTOByYear(races: RaceDTO[], year: number): RaceDTO[] {
  return races
    .filter((race) => race.raceDate.getFullYear() === year)
    .sort((a, b) => a.raceDate.getTime() - b.raceDate.getTime());
}

export function getContactPerson(
  organizers: OrganizerDTO[],
): OrganizerDTO | null {
  return organizers.find((organizer) => organizer.contactPerson) || null;
}

export function toDateString(date: Date): string {
  return date
    .toLocaleDateString("no-NO", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
    .replace(/\b([a-z])/, (c) => c.toUpperCase());
}

export function getPreviousRace(
  races: RaceDTO[],
  uuid?: string,
): RaceDTO | null {
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  return (
    races
      .filter((race) => race.raceDate < currentRace.raceDate)
      .sort((a, b) => b.raceDate.getTime() - a.raceDate.getTime())[0] ?? null
  );
}

export function getNextRace(races: RaceDTO[], uuid?: string): RaceDTO | null {
  const currentRace = races.find((race) => race.uuid === uuid);
  if (!currentRace) return null;
  return (
    races
      .filter((race) => race.raceDate > currentRace.raceDate)
      .sort((a, b) => a.raceDate.getTime() - b.raceDate.getTime())[0] ?? null
  );
}

export function mapResultTimeToNumber(resultTime: string): number {
  const match = resultTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
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

export function formatSecondsToTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "-";
  const rounded = Math.round(totalSeconds);
  const hh = Math.floor(rounded / 3600);
  const mm = Math.floor((rounded % 3600) / 60);
  const ss = rounded % 60;
  if (hh > 0) {
    return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  }
  return `${mm}:${String(ss).padStart(2, "0")}`;
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
        !rr.hideTime &&
        rr.resultTime &&
        new Date(rr.race.raceDate).getFullYear() === year,
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

export function formatDate(date: Date | undefined): string | undefined {
  return (
    date?.toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "long",
    }) ?? undefined
  );
}
export function formatDateFull(date: Date | undefined): string | undefined {
  return (
    date?.toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }) ?? undefined
  );
}
