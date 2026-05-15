import { format, parseISO } from "date-fns";
import { nb } from "date-fns/locale";

// Date formatting
export function getYear(date: string): number {
  return parseISO(date).getFullYear();
}

export function getDayAndMonth(date: string): string {
  return format(parseISO(date), "dd. MMMM", { locale: nb });
}

export function getDayMonthAndYear(date: string): string | undefined {
  if (!date) return undefined;
  return format(parseISO(date), "d. MMMM yyyy", { locale: nb });
}

export function getTimestamp(date: string): string {
  return format(parseISO(date), "HH:mm");
}

// Time formatting
export function convertSecondsToTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "-";

  const total = Math.round(totalSeconds);
  const hh = Math.floor(total / 3600);
  const mm = Math.floor((total % 3600) / 60);
  const ss = total % 60;

  const pad = (n: number) => String(n).padStart(2, "0");

  return hh > 0 ? `${hh}:${pad(mm)}:${pad(ss)}` : `${mm}:${pad(ss)}`;
}

export function convertTimeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);
  if (parts.length === 2) return (parts[0] ?? 0) * 60 + (parts[1] ?? 0);
  return (parts[0] ?? 0) * 3600 + (parts[1] ?? 0) * 60 + (parts[2] ?? 0);
}
