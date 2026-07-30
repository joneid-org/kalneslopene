import type { S3FileDto } from "@/model/DTO.ts";

export type PinCategory = "start" | "vending" | "poi" | "mal";

/** A photo rendered in the UI (url resolved at runtime from the backend config). */
export type StaticS3File = Omit<S3FileDto, "uuid"> & { fileName?: string };

/**
 * Source definition of a pin photo. The url is composed at runtime in
 * `CourseMap` from the backend-provided S3 base URL: `${s3BaseUrl}/static/${fileName}`,
 * falling back to `fallback` until the config has loaded.
 */
export type StaticPhoto = {
  fileName: string;
  fallback: string;
  description?: string;
};

export type Pin = {
  id: string;
  label: string;
  position: [number, number];
  color: string;
  category: PinCategory;
  distance: string;
  description: string;
  tips?: string;
  photo: StaticPhoto;
};

export const pins: Pin[] = [
  {
    id: "raymondsvingen",
    label: "Raymondsvingen",
    position: [59.29729, 11.03352],
    color: "#2563eb",
    category: "poi",
    distance: "360 m",
    description:
      "Dette er navnet på svingen som kommer etter 360 meter, der vi løper til høyre ut av Lundestadveien. Den har fått sitt navn etter Raymond Westberg. Raymond er en jovial og sympatisk løper, og blant de med flest løp i Torsdagsløpets over 45-årige historie. Siden Raymond liker å løpe raskt fra start har han ofte vært blant de første inn i denne svingen.",
    photo: {
      fileName: "raymondsvingen.webp",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "sletnersletta",
    label: "Sletnersletta",
    position: [59.30177, 11.03819],
    color: "#2563eb",
    category: "poi",
    distance: "1 - 1,4 km",
    description:
      "Strekningen fra 1 km-merket og deretter ca. 370 meter kalles Sletnersletta. Den har fått navn etter Dag Inge Sletner som har tidligere har gjort en formidabel innsats for å holde den blå løypa framkommelig. Høsten 2019 gravde han langt og lenge for å lede vannet vekk rett etter 1 km-merket. Dag løper også gjerne Torsdagsløpet.",
    photo: {
      fileName: "sletnersletta.webp",
      fallback:
        "https://images.unsplash.com/photo-1448387473223-5c37445527e7?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "baustadkollen",
    label: "Baustadkollen",
    position: [59.30575, 11.03292],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 1,55 km",
    description:
      "Etter ca. 1550 meter av løypa kommer vi til en liten forhøyning der det er ganske bratt på begge sider. Fra denne toppen er det god mulighet til å sette fart nedover. En av dem som liker å gjøre det er Alexander Baustad, en veldig hyggelig torsdagsløper. Han har fått æren av å gi navn til det vi har valgt å kalle en kolle, altså Baustadkollen.",
    photo: {
      fileName: "baustadkollen.webp",
      fallback:
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "bergerudpassasjen",
    label: "Bergerudpassasjen",
    position: [59.30596, 11.0326],
    color: "#2563eb",
    category: "poi",
    distance: "1,6 - 1,7 km",
    description:
      "Like etter Baustadkollen, vi er nå på mellom 1600 og 1700 meter, kommer vi til et parti der tidligere kunne være vanskelig å komme seg trygt og greit gjennom. Det var nødvendig både å legge på grus og gjøre andre grep for å lede vannet vekk. Hovedmannen bak dette er Svein Bergerud. Svein gjør en formidabel jobb med å forbedre og vedlikeholde de ulike løypene i Kalnesskogen. Han har dessuten vært med i samtlige torsdagsløp i perioden 2011-2019, og har deltatt i så å si hvert eneste løp etter dette. Det passer fint at han gir navn til denne strekningen, som er like før den blå og den gule løypa skiller lag.",
    photo: {
      fileName: "bergerudpassasjen.webp",
      fallback:
        "https://images.unsplash.com/photo-1476611338391-6f395a0dd82e?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "paulsrudholtet",
    label: "Paulsrudholtet",
    position: [59.3068, 11.03053],
    color: "#2563eb",
    category: "poi",
    distance: "1,72 - 1,92 km",
    description:
      "Strekningen fra 1720 meter til 1920 meter er kanskje den aller flotteste delen av den blåmerkede løypa. Du har ganske tett skog rundt deg, med en myk skogbunn beina dine kan kose seg med, og akkurat passe med røtter. Denne strekningen har vi valgt å gi navn etter Bjørn Paulsrud, en av Torsdagsløpets grunnleggere og trolig den viktigste personen i løpets historie. Han var ikke bare en løpsorganisator, men hadde også stor omsorg for løperne.",
    photo: {
      fileName: "paulsrudholtet.webp",
      fallback:
        "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "tomtrappa",
    label: "Tomtrappa",
    position: [59.3082, 11.02896],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 1,92 km",
    description:
      "Etter 1920 meter i løypa svinger vi omtrent 90 grader til venstre, og løper 20 meter oppover noe som kan minne om en trapp. Denne trappa har fått navn etter mannen som har flest torsdagsløp av alle, nemlig Tom Sognlien. Synes du det er litt tungt å løpe opp denne stigningen kan du jo tenke på at det er fullt mulig å gjøre nærmere 1000 ganger.",
    photo: {
      fileName: "tomtrappa.webp",
      fallback:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "liansvingen",
    label: "Liansvingen",
    position: [59.30727, 11.02132],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 2,4 km",
    description:
      "Etter 2400 meter gjør løypa en 90-graders sving til venstre. Den har fått navnet Liansvingen etter løperen Svein Lian, som en gang tok til venstre litt for tidlig og dermed kuttet svingen.\n",
    photo: {
      fileName: "liansvingen.webp",
      fallback:
        "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "proitztoppen",
    label: "Prøitztoppen",
    position: [59.30282, 11.02042],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 2,9 km",
    description:
      "Etter ca. 2,9 km i løypa er vi på en topp med flott utsikt, som vi har altfor lite tid til å nyte når vi løper Torsdagsløpet. Legg derfor turen innom her ved en annen anledning, gjerne når solen er i ferd med å stå opp. Denne toppen har fått navn etter Bjørn Paulsruds arvtaker og nåværende leder for Torsdagsløpet, Per Prøitz. Den tidligere habile løperen har de siste årene gjort en formidabel jobb som arrangør og tidtaker, og det er alltid hyggelig å komme til Torsdagsløpet når Per står ved startstreken.",
    photo: {
      fileName: "proitztoppen.webp",
      fallback:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "hundebakken",
    label: "Hundebakken",
    position: [59.29968, 11.02221],
    color: "#2563eb",
    category: "poi",
    distance: "ca. 3,4 km",
    description:
      "Hundebakken er et av de mest kjente stedene i torsdagsløypa, og et parti mange kjenner godt i beina. Bakken starter ved 3400 meter og er 130 meter lang, målt til der en annen sti går til venstre. Den har fått sitt navn etter en hund som pleide å bjeffe når løperne kom opp bakken.",
    tips: "Du er over halvveis - gi det du har igjen!",
    photo: {
      fileName: "hundebakken.webp",
      fallback:
        "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=900&q=80",
    },
  },
  {
    id: "helgekneika",
    label: "Helgekneika",
    position: [59.29823, 11.02568],
    color: "#2563eb",
    category: "poi",
    distance: "4,27 - 4,44 km",
    description:
      "Fra 4270 til 4440 meter i den blå løypa løper vi oppover en smal sti før vi kommer ut på Lundestadveien og skal spurte mot mål. Denne stien er en trivelig del av løypa, men på dette stadiet av løpet kjenner vi gjerne at kroppen er sliten og at vi trenger en oppmuntring. Derfor passer det bra å gi denne strekningen, som vi kan kalle en kneik, navn etter Helge Rosnes. Den tidligere og trofaste torsdagsløperen var alltid oppmuntrende og støttende overfor sine løpekolleger, noe mange satte stor pris på.",
    photo: {
      fileName: "helgekneika.webp",
      fallback:
        "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=80",
    },
  },
];

export const mapLegend = [
  { color: "#1f7a4d", label: "Navngitte steder i blåløypa" },
] as const;

export const MAP_CENTER: [number, number] = [59.302, 11.028];
export const MAP_ZOOM = 14;
