import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";

// Normalize whatever the backend sends into "YYYY-MM-DDTHH:MM:SS"
function normalizeRaceDate(raceDate: unknown): string {
  // Already a proper ISO string
  if (typeof raceDate === "string") return raceDate;
  // Date object (e.g. if someone constructs one)
  if (raceDate instanceof Date) {
    const y = raceDate.getFullYear();
    const mo = String(raceDate.getMonth() + 1).padStart(2, "0");
    const d = String(raceDate.getDate()).padStart(2, "0");
    const h = String(raceDate.getHours()).padStart(2, "0");
    const mi = String(raceDate.getMinutes()).padStart(2, "0");
    const s = String(raceDate.getSeconds()).padStart(2, "0");
    return `${y}-${mo}-${d}T${h}:${mi}:${s}`;
  }
  // Java LocalDateTime serialized as array [2026, 4, 16, 18, 0] or [2026, 4, 16, 18, 0, 0]
  if (Array.isArray(raceDate) && raceDate.length >= 3) {
    const [y, mo, d, h = 0, mi = 0, s = 0] = raceDate as number[];
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return String(raceDate);
}

// Parse ISO string "2026-04-16T18:00:00" directly — no timezone conversion
function parseDateParts(raceDate: unknown) {
  const iso = normalizeRaceDate(raceDate);
  const [datePart, timePart] = iso.split("T");
  const [year, month, day] = (datePart ?? "").split("-").map(Number);
  const [hours, minutes] = (timePart ?? "00:00").split(":").map(Number);
  return { year, month, day, hours, minutes };
}

export function extractYear(raceDate: unknown): number {
  if (Array.isArray(raceDate)) return (raceDate as number[])[0];
  if (raceDate instanceof Date) return raceDate.getFullYear();
  return Number(String(raceDate).split("-")[0]);
}

export function raceDateToSortKey(raceDate: unknown): string {
  if (Array.isArray(raceDate)) {
    const [y, mo, d, h = 0, mi = 0] = raceDate as number[];
    return `${y}-${String(mo).padStart(2, "0")}-${String(d).padStart(2, "0")}T${String(h).padStart(2, "0")}:${String(mi).padStart(2, "0")}`;
  }
  if (raceDate instanceof Date) return raceDate.toISOString();
  return String(raceDate);
}

export function formatDDMonth(raceDate: unknown): string {
  const { day, month } = parseDateParts(raceDate);
  const monthName = NORWEGIAN_MONTH_NAMES[(month ?? 1) - 1];
  return `${String(day).padStart(2, "0")}. ${monthName}`;
}

export function toDateString(raceDate: unknown): string {
  const { day, month, year } = parseDateParts(raceDate);
  const monthName = NORWEGIAN_MONTH_NAMES[(month ?? 1) - 1];
  return `${day}. ${monthName} ${year}`;
}

export function formatDate(raceDate: unknown): string | undefined {
  if (!raceDate) return undefined;
  const { day, month } = parseDateParts(raceDate);
  const monthName = NORWEGIAN_MONTH_NAMES[(month ?? 1) - 1];
  return `${String(day).padStart(2, "0")}. ${monthName}`;
}

export function formatDateFull(raceDate: unknown): string | undefined {
  if (!raceDate) return undefined;
  const { day, month, year } = parseDateParts(raceDate);
  const monthName = NORWEGIAN_MONTH_NAMES[(month ?? 1) - 1];
  return `${String(day).padStart(2, "0")}. ${monthName} ${year}`;
}

export function formatTimeStamp(raceDate: unknown): string {
  const { hours, minutes } = parseDateParts(raceDate);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

export function mapResultTimeToNumber(resultTime: string): number {
  const match = resultTime.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] ?? "0", 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const seconds = parseInt(match[3] ?? "0", 10);
  return hours * 3600 + minutes * 60 + seconds;
}
