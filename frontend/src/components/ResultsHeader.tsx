import { CloudIcon, MapPinIcon, TrophyIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { Race, Result } from "../data/mockdata.ts";
import StatBox from "./StatBox.tsx";
import WinnerItem from "./WinnerItem.tsx";

type ResultsHeaderProps = {
  race: Race;
  title: string;
  fastestM?: Result;
  fastestF?: Result;
};

export default function ResultsHeader({
  race,
  title,
  fastestM,
  fastestF,
}: ResultsHeaderProps) {
  return (
    <>
      {/* ── Hero image ── */}
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
        <img
          src={race.imageUrl}
          alt={title}
          className="w-full h-44 sm:h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        <Badge className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/60 text-white border-0 backdrop-blur-sm text-xs md:text-sm font-semibold px-2.5 py-1 md:px-3 md:py-1.5">
          Uke {race.week}
        </Badge>

        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 md:px-5 md:pb-5 text-white">
          <p className="text-sm md:text-lg font-semibold leading-snug">
            {new Date(race.date).toLocaleDateString("nb-NO", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex flex-wrap gap-x-3 mt-1 text-xs md:text-sm text-white/80">
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3 md:size-3.5" />
              {race.location}
            </span>
            {race.weatherConditions && (
              <span className="flex items-center gap-1">
                <CloudIcon className="size-3 md:size-3.5" />
                {race.weatherConditions}
              </span>
            )}
          </div>
          {race.highlights && (
            <p className="text-xs md:text-sm text-white/70 mt-1 line-clamp-2">
              {race.highlights}
            </p>
          )}
        </div>
      </div>

      {/* ── Stat boxes ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <StatBox
          icon={MapPinIcon}
          value={race.distance}
          label="Distanse"
          color="blue"
        />
        <StatBox
          icon={UsersIcon}
          value={race.participants}
          label="Deltakere"
          color="emerald"
        />
        <StatBox
          icon={TrophyIcon}
          value={fastestM?.time ?? "-"}
          label="Raskest"
          color="amber"
        />
      </div>

      {/* ── Winners summary ── */}
      {(fastestM || fastestF) && (
        <Card>
          <CardContent className="py-3 md:py-5 px-4 md:px-6">
            <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 md:mb-3">
              Ukens vinnere
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {fastestM && (
                <WinnerItem
                  result={fastestM}
                  label="Menn"
                  iconColor="text-blue-600"
                  bgColor="bg-blue-100"
                />
              )}
              {fastestF && (
                <WinnerItem
                  result={fastestF}
                  label="Kvinner"
                  iconColor="text-pink-600"
                  bgColor="bg-pink-100"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
