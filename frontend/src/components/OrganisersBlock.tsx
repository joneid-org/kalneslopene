import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { applySavedOrder } from "@/lib/organizerOrder.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const ordered = applySavedOrder(organizers ?? []);

  const O_TEXT =
    "Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert " +
    "ukentlige løp siden 1978. Vi er en gjeng entusiaster som brenner for " +
    "løping og fellesskap.";
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="size-4 text-primary" />
          Arrangørteamet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{O_TEXT}</p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {ordered.map((organizer) => (
            <div
              key={organizer.name}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/40"
            >
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="size-14 rounded-full object-cover border-2 border-muted shrink-0"
                />
              ) : (
                <div className="size-14 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                  {organizer.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-medium leading-tight">
                  {organizer.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {organizer.responsibility.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
