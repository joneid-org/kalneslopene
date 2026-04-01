import { useQuery } from "@tanstack/react-query";
import {
  CloudIcon,
  Images,
  MapPinIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import {
  findFastestRunnerInRace,
  findFastetFemaleInRace,
  findFastetMaleInRace,
  mapResultTimeToNumber,
} from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";
import StatBox from "./StatBox.tsx";
import WinnerItem from "./WinnerItem.tsx";

type ResultsHeaderProps = {
  race: RaceDTO;
  photosPath?: string;
};

export default function ResultsHeader({
  race,
  photosPath,
}: ResultsHeaderProps) {
  const { data: raceRunners } = useQuery(
    QUERIES.race.getAllRunnersInRace(race.uuid ?? ""),
  );
  const participants = raceRunners?.length;
  const fastestMaleInRace = findFastetMaleInRace(raceRunners ?? []);
  const fastestFemaleInRace = findFastetFemaleInRace(raceRunners ?? []);
  const fastestRunnerInRace = findFastestRunnerInRace(raceRunners ?? []);

  return (
    <>
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
        <img
          src="https://images.unsplash.com/photo-1692170226404-969b6e5cde95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJhdGhvbiUyMHJ1bm5lcnMlMjByYWNlJTIwZmluaXNoJTIwbGluZXxlbnwxfHx8fDE3NzEwNzIzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt=""
          className="w-full h-44 sm:h-64 md:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {photosPath && (
          <Button
            asChild
            size="sm"
            variant="secondary"
            className="absolute top-3 right-3 md:top-4 md:right-4 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm text-xs gap-1.5"
          >
            <Link to={photosPath}>
              <Images className="size-3.5" />
              Se bilder
            </Link>
          </Button>
        )}

        {/* ...existing bottom text... */}
        <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 md:px-5 md:pb-5 text-white">
          <p className="text-sm md:text-lg font-semibold leading-snug">
            {race.raceDate.toLocaleDateString("no-NO", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
          <div className="flex flex-wrap gap-x-3 mt-1 text-xs md:text-sm text-white/80">
            <span className="flex items-center gap-1">
              <MapPinIcon className="size-3 md:size-3.5" />
              Kalnesskogen
            </span>
            {race.weather && (
              <span className="flex items-center gap-1">
                <CloudIcon className="size-3 md:size-3.5" />
                {race.weather}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Stat boxes ── */}
      <div className="grid grid-cols-3 gap-2 md:gap-4">
        <StatBox
          icon={MapPinIcon}
          value="5,2 km"
          label="Distanse"
          color="blue"
        />
        <StatBox
          icon={UsersIcon}
          value={participants}
          label="Deltakere"
          color="green"
        />
        <StatBox
          icon={TrophyIcon}
          value={mapResultTimeToNumber(fastestRunnerInRace?.resultTime ?? "")}
          label="Raskest"
          color="amber"
        />
      </div>

      {/* ── Winners summary ── */}
      {(fastestFemaleInRace || fastestMaleInRace) && (
        <Card>
          <CardContent className="py-3 md:py-5 px-4 md:px-6">
            <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 md:mb-3">
              Ukens vinnere
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {fastestMaleInRace && (
                <WinnerItem
                  result={fastestMaleInRace}
                  label="Menn"
                  iconColor="text-blue-600"
                  bgColor="bg-blue-100"
                />
              )}
              {fastestFemaleInRace && (
                <WinnerItem
                  result={fastestFemaleInRace}
                  label="Kvinner"
                  iconColor="text-orange-600"
                  bgColor="bg-orange-100"
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
