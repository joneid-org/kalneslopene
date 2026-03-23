import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { RaceDTO } from "@/model/DTO.ts";

export function getAllYears(races: RaceDTO[] | undefined): number[] {
  const years = races?.map((race) => race.raceDate.getFullYear());
  return Array.from(new Set(years));
}

export function getAllRacesByYear(
  year: number,
  races: RaceDTO[] | undefined,
): string[] {
  const racesByYear = races
    ?.filter((race) => race.raceDate.getFullYear() === year)
    .map((race) => {
      const day = String(race.raceDate.getDate()).padStart(2, "0");
      const month = String(race.raceDate.getMonth() + 1).padStart(2, "0");
      return `${day}-${month}`;
    });

  return Array.from(new Set(racesByYear));
}

export function formatDateMonthDisplay(ddMM: string): string {
  const [day, month] = ddMM.split("-");
  if (!day || !month) return ddMM;
  const date = new Date(2000, Number(month) - 1, Number(day));
  const monthName = date.toLocaleString("nb-NO", { month: "long" });
  return `${day}. ${monthName}`;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
