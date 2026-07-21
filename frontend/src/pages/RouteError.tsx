import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Button } from "@/components/ui/button.tsx";

export function RouteError() {
  const error = useRouteError();

  const heading = isRouteErrorResponse(error)
    ? `${error.status} – ${error.statusText}`
    : "Noe gikk galt";

  const message = isRouteErrorResponse(error)
    ? "Siden du leter etter finnes ikke, eller er ikke tilgjengelig."
    : "En uventet feil oppstod. Prøv igjen senere.";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-gray-900">{heading}</h1>
        <p className="text-gray-600">{message}</p>
      </div>
      <Button asChild>
        <Link to="/">Tilbake til forsiden</Link>
      </Button>
    </div>
  );
}
