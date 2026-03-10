import { CheckCircle, Clock, MapPin, Ruler, ShoppingBag } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Separator } from "@/components/ui/separator.tsx";

const whatToBring = [
  "Løpesko",
  "Drikkeflaske",
  "Startnummer (fås ved oppmøte)",
  "Eventuelt refleks ved dårlig sikt",
];

const courseDetails = [
  { label: "Distanse", value: "5 km", icon: Ruler },
  { label: "Start & mål", value: "Kalneset", icon: MapPin },
  { label: "Starttid", value: "18:00", icon: Clock },
];

export default function RaceInfoBlock() {
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
        <p className="text-sm text-muted-foreground">
          Torsdagsløpet arrangeres hver torsdag gjennom sesongen. Løypa går
          langs kyststien på Kalneset og er tilgjengelig for alle nivåer. Ingen
          forhåndspåmelding – møt opp og løp!
        </p>
        <Button asChild variant="outline" size="sm">
          <Link to="/Løpsinformasjon">Les mer om løpet</Link>
        </Button>

        <Separator />

        <div className="flex items-center gap-2">
          <ShoppingBag className="size-4 text-primary" />
          <h4 className="font-semibold">Ta med</h4>
        </div>
        <ul className="space-y-2">
          {whatToBring.map((item) => (
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
