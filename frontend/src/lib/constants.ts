import {
  CalendarIcon,
  ClipboardListIcon,
  FileUpIcon,
  ImageIcon,
  NewspaperIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

export const DISTANCE_KM = 5.1;

export const ADMIN_ACTIONS = [
  { label: "Administrer løp", icon: CalendarIcon, path: "/admin/løp" },
  {
    label: "Registrer resultater",
    icon: ClipboardListIcon,
    path: "/admin/resultater",
  },
  {
    label: "Registrer resultat fra fil",
    icon: FileUpIcon,
    path: "/admin/resultater/import",
  },
  { label: "Legg til bilder", icon: ImageIcon, path: "/admin/bilder" },
  { label: "Legg til løper", icon: UserPlusIcon, path: "/admin/løpere" },
  { label: "Legg til arrangør", icon: UsersIcon, path: "/admin/arrangører" },
  { label: "Legg til nyhet", icon: NewspaperIcon, path: "/admin/nyheter" },
  { label: "Administrer tagger", icon: NewspaperIcon, path: "/admin/tagger" },
] as const;

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
