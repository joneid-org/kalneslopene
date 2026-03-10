import { Mail, Users } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

const organisers = [
  { name: "Erik Haugen", role: "Løpsleder", initials: "EH" },
  { name: "Marte Solberg", role: "Kasserer", initials: "MS" },
  { name: "Jonas Bakke", role: "Sekretær", initials: "JB" },
  { name: "Linn Dahl", role: "Frivillig koordinator", initials: "LD" },
];

export default function OrganisersBlock() {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Users className="size-4 text-primary" />
          Om arrangørene
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert
          ukentlige løp siden 2018. Vi er en gjeng entusiaster som brenner for
          løping og fellesskap.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {organisers.map((person) => (
            <div
              key={person.name}
              className="flex flex-col items-center text-center gap-2 p-3 rounded-lg bg-muted/40"
            >
              <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary shrink-0">
                {person.initials}
              </div>
              <div>
                <p className="text-sm font-medium leading-tight">
                  {person.name}
                </p>
                <p className="text-xs text-muted-foreground">{person.role}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <Link to="/Styret">Les mer om styret</Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <a
              href="mailto:kontakt@torsdagslop.no"
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
