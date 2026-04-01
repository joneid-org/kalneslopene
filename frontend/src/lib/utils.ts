import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { OrganizerDTO, RaceDTO, RaceRunnerDTO } from "@/model/DTO.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  return Array.from(
    new Set(races.map((race) => race.raceDate.getFullYear())),
  ).sort((a, b) => b - a);
}

const norwegianMonths = [
  "Januar",
  "Februar",
  "Mars",
  "April",
  "Mai",
  "Juni",
  "Juli",
  "August",
  "September",
  "Oktober",
  "November",
  "Desember",
];

export function formatDDMonth(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = norwegianMonths[date.getMonth()];
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
