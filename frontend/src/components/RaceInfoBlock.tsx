import { useQuery } from "@tanstack/react-query";
import {
  Car,
  CheckCircle,
  Clock,
  MapPin,
  Mic,
  Ruler,
  UserCheck,
  Wallet,
} from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { DISTANCE_KM } from "@/lib/constants.ts";
import { formatDDMonth, formatTimeStamp } from "@/lib/timeUtils.ts";
import { getUpcomingRaces } from "@/lib/utils.ts";

const practicalInfo = [
  { icon: Wallet, label: "Gratis", color: "text-green-600", bg: "bg-green-50" },
  {
    icon: UserCheck,
    label: "Alle aldre",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: Car,
    label: "Stor parkering",
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    icon: CheckCircle,
    label: "Ingen påmelding",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Mic,
    label: "Tid ropes opp",
    color: "text-pink-600",
    bg: "bg-pink-50",
  },
];

export default function RaceInfoBlock() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const nextRace = getUpcomingRaces(races ?? [])[0];

  return (
    <section className="space-y-6">
      {/* ── Course details strip ── */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="size-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
            <Ruler className="size-4 text-blue-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Distanse
            </p>
            <p className="font-bold text-gray-900">{DISTANCE_KM} km</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <div className="size-8 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
            <MapPin className="size-4 text-emerald-600" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              Sted
            </p>
            <p className="font-bold text-gray-900">Kalnesskogen</p>
          </div>
        </div>
        {nextRace && (
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <div className="size-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0">
              <Clock className="size-4 text-orange-500" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                {formatDDMonth(nextRace.raceDate)}
              </p>
              <p className="font-bold text-gray-900">
                kl {formatTimeStamp(nextRace.raceDate)}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* ── Practical info — icon pills ── */}
      <div className="flex flex-wrap gap-2">
        {practicalInfo.map(({ icon: Icon, label, color, bg }) => (
          <div
            key={label}
            className={`flex items-center gap-2 ${bg} ${color} text-xs font-semibold px-3 py-2 rounded-full`}
          >
            <Icon className="size-3.5 shrink-0" />
            {label}
          </div>
        ))}
      </div>
    </section>
  );
}
