import { useQuery } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";

export default function RaceCalendarSidebar() {
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarDays className="size-4 text-primary" />
          Kommende løp
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto">
        <UpcomingRaces />
      </CardContent>
    </Card>
  );
}

const UpcomingRaces = () => {
  const { data, isLoading } = useQuery(QUERIES.upComingRaces);

  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  if (data === undefined || data.length === 0)
    return (
      <p className="text-sm text-muted-foreground px-6 pb-4">
        Ingen kommende løp.
      </p>
    );
  return (
    <ul className="divide-y divide-border">
      {data.map((race) => {
        const date = new Date(race.raceDate);
        // const isNext = idx === 0;
        // const weekNum = race.week;

        return (
          <li key={race.id} className="flex items-start gap-3 px-6 py-3">
            {/* Date column */}
            <div className="flex flex-col items-center min-w-10 text-center">
              <span className="text-lg font-bold leading-none tabular-nums text-primary">
                {date.getDate()}
              </span>
              <span className="text-xs text-muted-foreground capitalize">
                {date.toLocaleDateString("nb-NO", { month: "short" })}
              </span>
            </div>

            {/* Details */}
            {/*<div className="flex-1 min-w-0">*/}
            {/*  <div className="flex items-center gap-2 flex-wrap">*/}
            {/*    <span className="text-sm font-medium">{race.name}</span>*/}
            {/*    {isNext && (*/}
            {/*      <Badge className="text-[10px] px-1.5 py-0 h-4 bg-green-100 text-green-700 border-green-200">*/}
            {/*        Neste*/}
            {/*      </Badge>*/}
            {/*    )}*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-3 mt-0.5 text-xs text-muted-foreground flex-wrap">*/}
            {/*    {race.time && (*/}
            {/*      <span className="flex items-center gap-1">*/}
            {/*        <Clock className="size-3" />*/}
            {/*        {race.time}*/}
            {/*      </span>*/}
            {/*    )}*/}
            {/*    <span className="flex items-center gap-1">*/}
            {/*      <MapPin className="size-3" />*/}
            {/*      {race.location}*/}
            {/*    </span>*/}
            {/*    <span className="text-xs text-muted-foreground">*/}
            {/*      Uke {weekNum}*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </li>
        );
      })}
    </ul>
  );
};
