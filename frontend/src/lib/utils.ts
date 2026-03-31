import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RaceDTO } from "@/model/DTO.ts";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getYears(races: RaceDTO[]): number[] {
  return Array.from(
    new Set(races.map((race) => race.raceDate.getFullYear())),
  ).sort((a, b) => b - a);
}

export function getRacesByYear(races: RaceDTO[], year: number): string[] {
  const norwegianMonths = [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember",
  ];

  const dates = races
    .filter((race) => race.raceDate.getFullYear() === year)
    .map((race) => {
      const day = String(race.raceDate.getDate()).padStart(2, "0");
      const month = norwegianMonths[race.raceDate.getMonth()];
      return `${day}.${month}`;
    });

  return Array.from(new Set(dates));
}
