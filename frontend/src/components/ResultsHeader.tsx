import {
  CloudIcon,
  MapPinIcon,
  TimerIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { Race, Result } from "../data/mockdata.ts";

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
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

        {/* Week badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/60 text-white text-xs md:text-sm font-semibold px-2.5 py-1 md:px-3 md:py-1.5 rounded backdrop-blur-sm">
          Uke {race.week}
        </div>

        {/* Bottom info */}
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
        {/* Distance */}
        <div className="rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
          <div className="bg-blue-100 rounded-full p-1.5 md:p-2.5">
            <MapPinIcon className="size-4 md:size-6 text-blue-600" />
          </div>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-blue-700 tabular-nums leading-none">
            {race.distance}
          </p>
          <p className="text-[10px] md:text-xs text-blue-500 font-medium uppercase tracking-wide">
            Distanse
          </p>
        </div>

        {/* Participants */}
        <div className="rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
          <div className="bg-emerald-100 rounded-full p-1.5 md:p-2.5">
            <UsersIcon className="size-4 md:size-6 text-emerald-600" />
          </div>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-emerald-700 tabular-nums leading-none">
            {race.participants}
          </p>
          <p className="text-[10px] md:text-xs text-emerald-500 font-medium uppercase tracking-wide">
            Deltakere
          </p>
        </div>

        {/* Fastest time */}
        <div className="rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
          <div className="bg-amber-100 rounded-full p-1.5 md:p-2.5">
            <TrophyIcon className="size-4 md:size-6 text-amber-600" />
          </div>
          <p className="text-base sm:text-lg md:text-2xl font-bold text-amber-700 tabular-nums leading-none">
            {fastestM?.time ?? "-"}
          </p>
          <p className="text-[10px] md:text-xs text-amber-500 font-medium uppercase tracking-wide">
            Raskest
          </p>
        </div>
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
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 md:p-2.5 shrink-0">
                    <TimerIcon className="size-3.5 md:size-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Menn
                    </p>
                    <p className="text-xs md:text-base font-semibold truncate">
                      {fastestM.runnerName}
                    </p>
                    <p className="text-xs md:text-sm tabular-nums text-muted-foreground">
                      {fastestM.time}
                    </p>
                  </div>
                </div>
              )}
              {fastestF && (
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-pink-100 rounded-full p-1.5 md:p-2.5 shrink-0">
                    <TimerIcon className="size-3.5 md:size-5 text-pink-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Kvinner
                    </p>
                    <p className="text-xs md:text-base font-semibold truncate">
                      {fastestF.runnerName}
                    </p>
                    <p className="text-xs md:text-sm tabular-nums text-muted-foreground">
                      {fastestF.time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
