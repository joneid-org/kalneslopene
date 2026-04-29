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
      <CardHeader className="pb-2 text-[#173d2b]">
        <CardTitle className="flex items-center gap-2">
          <Users className="size-4 font-bold " />
          ARRANGØRTEAMET
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm ">{O_TEXT}</p>
        <div className="grid grid-cols-3 gap-3">
          {ordered.map((organizer) => (
            <div
              key={organizer.name}
              className="flex align-middle gap-3 items-center"
            >
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="size-14 rounded-full object-cover border-2 border-muted shrink-0"
                />
              ) : (
                <div className="size-14 rounded-md bg-[#173d2b]/10 flex items-center justify-center text-sm font-semibold text-[#173d2b] shrink-0">
                  {organizer.initials}
                </div>
              )}
              <div>
                <p className="text-sm font-bold leading-tight">
                  {organizer.name}
                </p>
                <p className="text-xs ">
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
