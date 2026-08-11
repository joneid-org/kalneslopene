import { Button } from "@/components/ui/button.tsx";

export function ErrorFallback() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-xl font-semibold sm:text-2xl">Noe gikk galt</h1>
      <p className="text-muted-foreground max-w-prose">
        Vi har fått beskjed om feilen og ser på den. Prøv å laste siden på nytt.
      </p>
      <Button onClick={() => window.location.reload()}>Last inn på nytt</Button>
    </div>
  );
}
