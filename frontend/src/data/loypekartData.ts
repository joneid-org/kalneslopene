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
    position: [59.29831, 11.03969],
    color: "#16a34a",
    category: "start",
    distance: "0 / 5,1 km",
    description:
        "Samlingspunktet for alle løpere. Her gis det informasjon om løypen, og tidtakingen starter og stopper her.",
    tips: "Møt opp senest 10 minutter før start. Parkering er tilgjengelig like ved.",
  },
  {
    id: "raymondsvingen",
    label: "Raymondsvingen",
    position: [59.29961, 11.03656],
    color: "#2563eb",
    category: "poi",
    distance: "360 m",
    description:
        "Dette er navnet på svingen som kommer etter 360 meter, der vi løper til høyre ut av Lundestadveien. Den har fått sitt navn etter Raymond Westberg. Raymond er en jovial og sympatisk løper, og blant de med flest løp i Torsdagsløpets over 40-årige historie. Siden Raymond liker å løpe raskt fra start har han ofte vært blant de første inn i denne svingen.",
  },
  {
    id: "sletnersletta",
    label: "Sletnersletta",
    position: [59.30096, 11.03855],
    color: "#2563eb",
    category: "poi",
    distance: "1 - 1,4 km",
    description:
        "Strekningen fra 1 km-merket og deretter ca. 370 meter kaller vi nå Sletnersletta. Den har fått navn etter Kalnes-lærer og torsdagsløp-ildsjel Dag Inge Sletner. Han har gjort en formidabel innsats for å holde den blå løypa framkommelig, og høsten 2019 gravde han langt og lenge for å lede vannet vekk rett etter 1 km-merket. Dag løper også gjerne Torsdagsløpet, og gjør han ikke det hjelper han gjerne til med arrangementet.",
  },
  {
    id: "baustadkollen",
    label: "Baustadkollen",
    position: [59.30264, 11.03622],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 1,55 km",
    description:
        "Etter ca. 1550 meter av løypa kommer vi til en liten forhøyning der det er ganske bratt på begge sider. Fra denne toppen er det god mulighet til å sette fart nedover. En av dem som liker å gjøre det er Alexander Baustad, en hyggelig og relativt ung torsdagsløper. Han har fått æren av å gi navn til det vi har valgt å kalle en kolle, altså Baustadkollen.",
  },
  {
    id: "bergerudpassasjen",
    label: "Bergerudpassasjen",
    position: [59.30290, 11.03544],
    color: "#2563eb",
    category: "poi",
    distance: "1,6 - 1,7 km",
    description:
        "Like etter Baustadkollen, vi er nå på mellom 1600 og 1700 meter, kommer vi til et parti der det for en tid tilbake kunne være vanskelig å komme seg trygt og greit gjennom. Det var nødvendig både å legge på grus og gjøre andre grep for å lede vannet vekk. Hovedmannen bak dette er Svein Bergerud. Svein gjør en formidabel jobb med å forbedre og vedlikeholde de ulike løypene i Kalnesskogen. Han har dessuten vært med i samtlige torsdagsløp i perioden 2011-2019. Det passer fint at han gir navn til denne strekningen, som er like før den blå og den gule løypa skiller lag.",
  },
  {
    id: "paulsrudholtet",
    label: "Paulsrudholtet",
    position: [59.30356, 11.03484],
    color: "#2563eb",
    category: "poi",
    distance: "1,72 - 1,92 km",
    description:
        "Strekningen fra 1720 meter til 1920 meter er kanskje den aller flotteste delen av den blåmerkede løypa. Du har ganske tett skog rundt deg, med en myk skogsbunn beina dine kan kose seg med, og akkurat passe med røtter. Denne strekningen har vi valgt å gi navn etter Bjørn Paulsrud, en av Torsdagsløpets grunnleggere og trolig den viktigste personen i løpets historie. Han var ikke bare en løpsorganisator, men hadde også stor omsorg for løperne.",
  },
  {
    id: "tomtrappa",
    label: "Tomtrappa",
    position: [59.30414, 11.03428],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 1,92 km",
    description:
        "Etter 1920 meter i løypa svinger vi omtrent 90 grader til venstre, og løper 20 meter oppover noe som kan minne om en trapp. Denne trappa har fått navn etter mannen som har løpt over 1000 torsdagsløp, nemlig Tom Sognlien. Synes du det er litt tungt å løpe opp denne stigningen kan du jo tenke på at det er fullt mulig å gjøre det over 1000 ganger.",
  },
  {
    id: "proitztoppen",
    label: "Prøitztoppen",
    position: [59.30677, 11.03058],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 2,9 km",
    description:
        "Etter ca. 2,9 km i løypa er vi på en topp med flott utsikt, som vi har altfor lite tid til å nyte når vi løper Torsdagsløpet. Legg derfor turen innom her ved en annen anledning, gjerne når solen er i ferd med å stå opp. Denne toppen har nå fått navn etter Bjørn Paulsruds arvtaker og nåværende leder for Torsdagsløpet, Per Prøitz. Den tidligere habile løperen har de siste årene gjort en formidabel jobb som arrangør og tidtaker, og det er alltid hyggelig å komme til Torsdagsløpet når Per står ved startstreken.",
  },
  {
    id: "hundebakken",
    label: "Hundebakken",
    position: [59.30199, 11.02512],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 3,4 km",
    description:
        "Et av de mest kjente stedene i løypa, og det med lengst tradisjon for navn blant løperne. En krevende bakke som tester bena sent i løypa.",
    tips: "Du er over halvveis - gi det du har igjen!",
  },
  {
    id: "liansvingen",
    label: "Liansvingen",
    position: [59.30068, 11.02328],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 2,4 km",
    description:
        "En av de få stedene i løypa som lenge har hatt et allment kjent navn blant løperne. Et godt referansepunkt halvveis ut i skogen.",
  },
  {
    id: "helgekneika",
    label: "Helgekneika",
    position: [59.29912, 11.02589],
    color: "#2563eb",
    category: "poi",
    distance: "4,27 - 4,44 km",
    description:
        "Fra 4270 til 4440 meter i den blå løypa løper vi oppover en smal sti før vi kommer ut på Lundestadveien og skal spurte mot mål. Denne stien er en trivelig del av løypa, men på dette stadiet av løpet kjenner vi gjerne at kroppen er sliten og at vi trenger en oppmuntring. Derfor passer det bra å gi denne strekningen, som vi kan kalle en kneik, navn etter Helge Rosnes. Den trofaste torsdagsløperen er alltid oppmuntrende og støttende overfor sine løpekolleger, noe mange setter stor pris på.",
  },
  {
    id: "v1",
    label: "Vendepunkt blå løype",
    position: [59.30732, 11.02124],
    color: "#16a34a",
    category: "vending",
    distance: "ca. 4 km",
    description:
        "Vendepunktet for blå løype. Herfra snur du og følger samme trase tilbake til mål.",
    tips: "God mulighet til å sjekke tempoet - du er snart ferdig!",
  },
];

export const categoryLabel: Record<PinCategory, string> = {
  start: "Start / Mål",
  vending: "Vendepunkt",
  poi: "Interessepunkt",
  mal: "Mål",
};

export const categoryVariant: Record<PinCategory, "default" | "secondary" | "outline" | "destructive"> = {
  start: "default",
  vending: "secondary",
  poi: "outline",
  mal: "default",
};

export const mapLegend = [
  { color: "#16a34a", label: "Start / Mål & vendepunkt" },
  { color: "#2563eb", label: "Navngitte steder i blåløypa" },
  { color: "#dc2626", label: "Krevende parti" },
  { color: "#d97706", label: "Utsiktspunkt" },
] as const;

export const MAP_CENTER: [number, number] = [59.302, 11.028];
export const MAP_ZOOM = 14;