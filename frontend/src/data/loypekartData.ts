export type PinCategory = "start" | "vending" | "poi" | "mal";

export type Pin = {
  id: string;
  label: string;
  position: [number, number];
  color: string;
  category: PinCategory;
  distance: string;
  description: string;
  tips?: string;
};

export const pins: Pin[] = [
  {
    id: "start",
    label: "Start / Mål",
    position: [58.3452, 8.5931],
    color: "#16a34a",
    category: "start",
    distance: "0 / 8 km",
    description:
      "Samlingspunktet for alle løpere. Her gis det informasjon om løypen, og tidtakingen starter og stopper her.",
    tips: "Møt opp senest 10 minutter før start. Parkering er tilgjengelig like ved.",
  },
  {
    id: "v1",
    label: "Vendepunkt blå løype",
    position: [58.3521, 8.6095],
    color: "#2563eb",
    category: "vending",
    distance: "4 km",
    description:
      "Vendepunktet for blå løype (ca. 8 km). Herfra snur du og følger samme trase tilbake til mål.",
    tips: "God mulighet til å sjekke tempoet — du er halvveis!",
  },
  {
    id: "v2",
    label: "Vendepunkt grønn løype",
    position: [58.3488, 8.6008],
    color: "#16a34a",
    category: "vending",
    distance: "2 km",
    description:
      "Vendepunktet for grønn løype (ca. 4 km). Perfekt for yngre løpere og mosjonister.",
  },
  {
    id: "poi1",
    label: "Utsiktspunkt",
    position: [58.351, 8.5975],
    color: "#d97706",
    category: "poi",
    distance: "ca. 2,5 km",
    description:
      "Et flott utsiktspunkt med fin sikt over Aust-Agder. Populært hvilestopp på treningsøkter.",
    tips: "Stopp opp og nyt utsikten — du fortjener det!",
  },
  {
    id: "poi2",
    label: "Bratt bakke",
    position: [58.3475, 8.5988],
    color: "#dc2626",
    category: "poi",
    distance: "ca. 1,5 km",
    description:
      "Den beryktet bratte bakken som tester både ben og vilje. Mange velger å gå her — og det er helt greit!",
    tips: "Kort og intens — hold igjen litt i bunn så du har krefter til toppen.",
  },
  {
    id: "poi3",
    label: "Skogsti",
    position: [58.3535, 8.604],
    color: "#7c3aed",
    category: "poi",
    distance: "ca. 3,5 km",
    description:
      "En fin seksjon gjennom tett granskog med mykt underlag. Behagelig å løpe, men pass på røtter i bakken.",
  },
];

export const blaaRoute: [number, number][] = [
  [58.3452, 8.5931],
  [58.3465, 8.595],
  [58.3475, 8.5988],
  [58.3488, 8.6008],
  [58.351, 8.5975],
  [58.3535, 8.604],
  [58.3521, 8.6095],
  [58.3505, 8.611],
  [58.349, 8.608],
  [58.347, 8.605],
  [58.3455, 8.601],
  [58.3452, 8.5931],
];

export const gronnRoute: [number, number][] = [
  [58.3452, 8.5931],
  [58.3465, 8.595],
  [58.3475, 8.5988],
  [58.3488, 8.6008],
  [58.3475, 8.5988],
  [58.3465, 8.595],
  [58.3452, 8.5931],
];

export const categoryLabel: Record<PinCategory, string> = {
  start: "Start / Mål",
  vending: "Vendepunkt",
  poi: "Interessepunkt",
  mal: "Mål",
};

export const categoryVariant: Record<
  PinCategory,
  "default" | "secondary" | "outline" | "destructive"
> = {
  start: "default",
  vending: "secondary",
  poi: "outline",
  mal: "default",
};

export const mapLegend = [
  { color: "#16a34a", label: "Start / Mål & grønn løype" },
  { color: "#2563eb", label: "Blå løype (8 km)" },
  { color: "#d97706", label: "Utsiktspunkt" },
  { color: "#dc2626", label: "Krevende parti" },
  { color: "#7c3aed", label: "Interessepunkt" },
] as const;

export const MAP_CENTER: [number, number] = [58.349, 8.601];
export const MAP_ZOOM = 14;
