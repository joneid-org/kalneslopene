import {
  CalendarIcon,
  ClipboardListIcon,
  ClipboardPenIcon,
  FileUpIcon,
  ImageIcon,
  type LucideIcon,
  MapPinIcon,
  NewspaperIcon,
  ShieldUserIcon,
  SquareParkingIcon,
  TimerIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

export const DISTANCE_KM = 5.1;

type AdminAction = {
  label: string;
  icon: LucideIcon;
  path: string;
  adminOnly?: boolean;
};

export const ADMIN_ACTIONS: AdminAction[] = [
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
  {
    label: "Brukeradministrasjon",
    icon: ShieldUserIcon,
    path: "/admin/brukere",
    adminOnly: true,
  },
];

export function visibleAdminActions(roles: string[]): AdminAction[] {
  return ADMIN_ACTIONS.filter(
    (action) => !action.adminOnly || roles.includes("ADMIN"),
  );
}

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

export const PRACTICAL_INFO_INTRO =
  "Torsdagsløpet ønsker alle hjertelig velkommen til å delta. Vi har plass " +
  "til alle uansett alder og nivå, og vil gjøre vårt beste for at deltakerne " +
  "skal få en god opplevelse.";

export const PRACTICAL_INFO = [
  {
    title: "Oppmøtested",
    icon: MapPinIcon,
    text:
      "Start og mål er ved parkeringsplassen i krysset mellom Lundestadveien " +
      "og Gamle Kongevei i Kalnesskogen. Startbua er som regel betjent fra " +
      "45 minutter før start.",
  },
  {
    title: "Påmelding",
    icon: ClipboardPenIcon,
    text:
      "Det er ingen forhåndspåmelding, så her er det bare å møte opp. Meld " +
      "deg på hos vår ansvarlige i eller ved startbua senest noen minutter " +
      "før start, og si gjerne fra dersom du er helt ny i Torsdagsløpet. Det " +
      "er ingen deltakeravgift.",
  },
  {
    title: "Parkering",
    icon: SquareParkingIcon,
    text:
      "Asfaltert parkeringsplass finnes rett ved startområdet i begynnelsen " +
      "av Lundestadveien. Denne kan bli fort full, men man kan også parkere " +
      "langs Gamle Kongevei og den første delen av Lundestadveien.",
  },
  {
    title: "Tidtaking",
    icon: TimerIcon,
    text:
      "Din tid blir ropt opp ved målgang, og denne oppgir du i startbua. " +
      "Ønsker du ikke tiden din i den endelige resultatlisten, kan du i " +
      "stedet velge å stå med «deltatt».",
  },
] as const;

export const PRACTICAL_INFO_FOOTNOTE =
  "Ukens resultatliste blir presentert på hjemmesiden og Facebook noen timer " +
  "etter løpet, og sendes til lokalavisen SA dagen etter. Bilder fra løpet " +
  "legges som regel ut i løpet av de to påfølgende dagene — si fra til oss " +
  "dersom du ikke ønsker bildet ditt vist.";

export const ORGANIZER_DESCRIPTION =
  "Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert " +
  "ukentlige løp siden 1978. Vi er en gjeng entusiaster som brenner for " +
  "løping og fellesskap.";
