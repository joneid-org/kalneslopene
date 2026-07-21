export const DISTANCE_KM = 5.1;

export const COLUMN_LABELS: Record<string, string> = {
  position: "#",
  runnerName: "NAVN",
  time: "TID",
  pace: "MIN/KM",
  yearBest: "ÅRSBESTE",
  pr: "PERS",
  races: "LØP",
};

export const HIDEABLE_COLUMNS = ["pace", "yearBest", "pr", "races"] as const;

export const NORWEGIAN_MONTH_NAMES = [
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

export const ORGANIZER_DESCRIPTION =
  "Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert " +
  "ukentlige løp siden 1978. Vi er en gjeng entusiaster som brenner for " +
  "løping og fellesskap.";
