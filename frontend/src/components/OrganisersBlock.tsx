import { useQuery } from "@tanstack/react-query";
import { Mail, Phone, Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export default function OrganisersBlock() {
  const { data: organizer } = useQuery(QUERIES.organizers);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="size-4 text-primary" />
          Styret
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert
          ukentlige løp siden 1978. Vi er en gjeng entusiaster som brenner for
          løping og fellesskap.
        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
          {organizer?.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/40 w-full sm:w-auto sm:min-w-50 sm:flex-1"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {person.initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-tight">
                  {person.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {person.responsibility}
                </p>
                <div className="mt-2 space-y-1">
                  <a
                    href={`mailto:${person.email}`}
                    className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    {person.email && (
                      <a
                        href={`mailto:${person.email}`}
                        className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Mail className="size-3 shrink-0" />
                        {person.email}
                      </a>
                    )}
                  </a>
                  <a
                    href={`tel:${person.phone}`}
                    className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Phone className="size-3 shrink-0" />
                    {person.phone}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a
              href="mailto:emilienilseen98@gmail.com"
              className="flex items-center gap-1.5"
            >
              <Mail className="size-3.5" />
              Kontakt oss
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
