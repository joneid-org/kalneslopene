import { useQuery } from "@tanstack/react-query";
import { Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { ORGANIZER_DESCRIPTION } from "@/lib/constants.ts";
import { applySavedOrder } from "@/lib/organizerOrder.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const ordered = applySavedOrder(organizers ?? []);

  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-primary">
          <Users className="size-5" />
          <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
            Arrangørteamet
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {ORGANIZER_DESCRIPTION}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ordered.map((organizer) => (
            <div
              key={organizer.name}
              className="flex gap-3 items-center bg-background border rounded-xl p-3"
            >
              {organizer.image ? (
                <img
                  src={organizer.image}
                  alt={organizer.name}
                  className="size-11 rounded-xl object-cover shrink-0"
                />
              ) : (
                <div className="size-11 rounded-xl bg-secondary flex items-center justify-center font-display text-sm font-extrabold text-secondary-foreground shrink-0">
                  {organizer.initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight">
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
