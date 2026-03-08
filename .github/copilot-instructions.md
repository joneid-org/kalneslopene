# Prosjektdokumentasjon

Dette prosjektet er bygget med fokus på moderne webutvikling og brukervennlighet. Her er noen viktige punkter:

## Teknologier
- **Tailwind CSS** brukes for stilsetting og gir et responsivt, mobilvennlig design.
- **shadcn/ui** benyttes for gjenbrukbare og tilgjengelige UI-komponenter.

## Designprinsipper
- **Mobile first**: Alt design og layout er optimalisert for mobilopplevelse først, deretter tilpasset større skjermer.
- **Norsk språk**: Hele brukergrensesnittet er skrevet på norsk for å gi en lokal og brukervennlig opplevelse.

## Komme i gang
1. Installer avhengigheter:
   - For frontend: `npm install`
   - For backend (hvis aktuelt): `./gradlew build` eller tilsvarende
2. Start utviklingsserver:
   - Frontend: `npm run dev`
   - Backend: `./gradlew bootRun`

## Utviklingsnotater
- Følg Tailwind CSS sine retningslinjer for klasseskriving.
- Bruk shadcn/ui-komponenter der det er mulig for konsistent utseende.
- Husk å skrive alt brukerrettet innhold på norsk.
- Alle nødvendige pakker for shadcn/ui er allerede installert (`class-variance-authority`, `clsx`, `tailwind-merge`, `lucide-react`, `radix-ui`, `vaul`, `shadcn`). Ikke installer disse på nytt – stol på at de er tilgjengelige.
- Når du legger til nye shadcn/ui-komponenter, bruk `npx shadcn add <komponent>` fra `frontend/`-mappen.

---

For spørsmål, se prosjektets README eller kontakt utviklerteamet.

