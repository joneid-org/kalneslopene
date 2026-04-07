import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, MapPin, Ruler, ShoppingBag } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { DISTANCE_KM, RACE_INFORMATION } from "@/lib/constants.ts";
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
    {
      label: "Distanse",
      value: `${DISTANCE_KM} km`,
      icon: Ruler,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-100",
    },
    {
      label: "Start & mål",
      value: "Kalnesskogen",
      icon: MapPin,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100",
    },
    {
      label: "Starttid",
      value: nextRace ? formatTimeStamp(nextRace.raceDate) : "-",
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-50 border-orange-100",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 rounded-full bg-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Løpsinformasjon
        </h2>
        {nextRace && (
          <span className="ml-auto text-xs text-gray-400 font-medium hidden sm:block">
            Neste løp: {formatTimeStamp(nextRace.raceDate)}
          </span>
        )}
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-3 gap-4">
        {courseDetails.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className={`flex flex-col items-center text-center py-5 px-3 rounded-2xl ${bg} border gap-2`}
          >
            <Icon className={`size-6 ${color}`} />
            <p className={`font-bold text-base ${color}`}>{value}</p>
            <p className="text-xs text-gray-500 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Info text */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {RACE_INFORMATION}
      </p>

      <Separator />

      {/* Practical info */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <ShoppingBag className="size-4 text-blue-600" />
          <h3 className="font-semibold text-gray-800 text-sm">
            Praktisk informasjon
          </h3>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {practicalInformation.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-sm text-gray-700 bg-white border border-gray-100 rounded-xl px-4 py-2.5 shadow-xs"
            >
              <CheckCircle className="size-4 text-green-500 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
