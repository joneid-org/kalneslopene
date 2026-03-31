import { useQuery } from "@tanstack/react-query";
import { Mail, Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { getContactPerson } from "@/lib/utils.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  const O_TEXT =
    "Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert\n" +
    "          ukentlige løp siden 2018. Vi er en gjeng entusiaster som brenner for\n" +
    "          løping og fellesskap.";
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="size-4 text-primary" />
          Om arrangørene
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{O_TEXT}</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {organizers?.map((organizer) => (
            <div
              key={organizer.name}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/40"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {organizer.initials}
              </div>
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

        <div className="flex flex-wrap gap-2 justify-end">
          <Button asChild variant="outline" size="sm">
            <a
              href={`mailto:${mainContact?.email}`}
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
