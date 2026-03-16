import { CheckCircle, Clock, MapPin, Ruler } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import type { RaceDTO } from "@/model/DTO.ts";

const pointers = ["Gratis", "For alle"];

interface RaceInfoBlockProps {
  races: RaceDTO[] | undefined;
}

export default function RaceInfoBlock({ races }: RaceInfoBlockProps) {
  const nextRaceTime = races?.[0]
    ? new Date(races[0].raceDate).toLocaleTimeString("nb-NO", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "18:00";

  const courseDetails = [
    { label: "Distanse", value: "5.2 km", icon: Ruler },
    { label: "Start & mål", value: "Kalnesskogen", icon: MapPin },
    { label: "Starttid", value: nextRaceTime, icon: Clock },
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          Praktisk informasjon
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {courseDetails.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center p-3 rounded-lg bg-muted/40 gap-1"
            >
              <Icon className="size-4 text-primary mb-0.5" />
              <p className="font-semibold text-sm">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Torsdagsløpet ønsker alle hjertelig velkommen til å delta. Det er
          ingen forhåndspåmelding, så her er det bare å møte opp. Det er fint om
          du sier fra dersom du er helt ny i Torsdagsløpet. Startbua er som
          regel betjent fra 45 minutter før start. Asfaltert parkeringsplass
          finnes rett ved startområdet i begynnelsen av Lundestadveien. Denne
          kan bli fort full, men man kan også parkere langs Gamle Kongevei og
          den første delen av Lundestadveien. Din tid blir ropt opp ved målgang,
          og denne oppgir du i startbua. Dersom du ikke ønsker at tiden skal bli
          med i den endelige resultatlisten kan du i stedet velge å stå med
          «deltatt». Ukens resultatliste blir presentert på hjemmesiden og
          Facebook noen timer etter løpet. Resultatene sendes også til
          lokalavisen SA dagen etter. Når det blir tatt bilder fra Torsdagsløpet
          blir disse som regel lagt ut i løpet av de to påfølgende dagene.
          Dersom du ikke ønsker å få ditt bilde vist på hjemmesiden eller
          Facebook kan du gi beskjed ved å sende oss en melding.
        </p>

        <Separator />

        {/*<div className="flex items-center gap-2">*/}
        {/*  <ShoppingBag className="size-4 text-primary" />*/}
        {/*  <h4 className="font-semibold">Ta med</h4>*/}
        {/*</div>*/}
        <ul className="space-y-2">
          {pointers.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm">
              <CheckCircle className="size-3.5 text-green-600 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
