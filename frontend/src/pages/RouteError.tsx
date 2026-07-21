import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "@/components/ui/button.tsx";

const notFoundJokes = [
  "Denne siden løp fra oss. Den har alltid vært raskere enn resten av feltet.",
  "Feil løype! Du bommet på målstreken med akkurat 404 meter.",
  "Her var det tomt – bare litt melkesyre og en glemt drikkeflaske.",
  "Siden tok en snarvei gjennom skogen og gikk seg vill. Klassisk torsdagsblunder.",
];

const crashJokes = [
  "Serveren fikk krampe rett før mål og måtte gå av løypa.",
  "Noe her sprakk som en gammel joggesko i siste bakke.",
  "Vi snublet i skolissene. Gi oss et øyeblikk til å reise oss igjen.",
  "Teknisk sett: melkesyre i koden. Vi tøyer ut og prøver på nytt.",
];

function pick(jokes: string[]) {
  return jokes[Math.floor(Math.random() * jokes.length)];
}

function getStatus(error: unknown): number | undefined {
  if (isRouteErrorResponse(error)) return error.status;
  if (error instanceof Response) return error.status;
  return undefined;
}

export function RouteError() {
  const error = useRouteError();
  // Rendered as an ErrorBoundary (thrown error/Response present) or as the
  // catch-all "*" route (no error). Anything that isn't a genuine thrown
  // Error — a 4xx Response, or a plain missing route — is a "not found".
  const status = getStatus(error);
  const isNotFound = !error || (status !== undefined && status < 500);

  const heading = isNotFound
    ? `${status ?? 404} – Du har løpt deg vill`
    : "Uff, her datt vi på tampen";

  const message = isNotFound ? pick(notFoundJokes) : pick(crashJokes);

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
      <span className="text-6xl" aria-hidden="true">
        🏃💨
      </span>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">{heading}</h1>
        <p className="max-w-md text-gray-600">{message}</p>
      </div>
      <Button asChild>
        <Link to="/">Tilbake til start</Link>
      </Button>
    </div>
  );
}
