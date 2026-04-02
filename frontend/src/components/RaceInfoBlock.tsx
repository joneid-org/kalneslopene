import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, MapPin, Ruler, ShoppingBag } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { RACE_INFORMATION } from "@/lib/constants.ts";
import { formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

const practicalInformation = [
  "Gratis",
  "For alle aldre og nivåer",
  "Stor parkeringsplass",
  "Ingen forhåndspåmelding",
  "Tid ropes opp ved målgang",
];

export default function RaceInfoBlock() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  const courseDetails = [
    { label: "Distanse", value: "5.2 km", icon: Ruler },
    { label: "Start & mål", value: "Kalnesskogen", icon: MapPin },
    {
      label: "Starttid",
      value: nextRace ? formatTimeStamp(nextRace.raceDate) : "-",
      icon: Clock,
    },
  ];
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <MapPin className="size-4 text-primary" />
          Løpsinformasjon
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
        <p className="text-sm text-muted-foreground">{RACE_INFORMATION}</p>

        <Separator />

        <div className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-primary" />
          <h4 className="font-semibold">Praktisk informasjon</h4>
        </div>
        <ul className="space-y-2">
          {practicalInformation.map((item) => (
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
