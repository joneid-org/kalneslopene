import { NORWEGIAN_MONTH_NAMES } from "@/lib/constants.ts";

export function formatDDMonth(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = NORWEGIAN_MONTH_NAMES[date.getMonth()];
  return `${day}. ${month}`;
}

export function formatDateFull(date: Date | undefined): string | undefined {
  return (
    date
      ?.toLocaleDateString("no-NO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
      .replace(/\b([a-z])/, (c) => c.toUpperCase()) ?? undefined
  );
}

export function formatDate(date: Date | undefined): string | undefined {
  return (
    date?.toLocaleDateString("no-NO", {
      day: "2-digit",
      month: "long",
    }) ?? undefined
  );
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

export function formatTimeStamp(date: Date): string {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
