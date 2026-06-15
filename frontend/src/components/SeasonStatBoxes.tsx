import { useQuery } from "@tanstack/react-query";
import {
  ChartColumnIncreasing,
  Footprints,
  type LucideIcon,
  Mars,
  SportShoe,
  Users,
  Venus,
} from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Card } from "@/components/ui/card.tsx";

const CURRENT_YEAR = new Date().getFullYear();

type Stat = {
  icon: LucideIcon;
  value?: number | string;
  label: string;
};

export function SeasonStatBoxes() {
  const { data: yearStatistics } = useQuery(
    QUERIES.statistics.race(CURRENT_YEAR),
  );

  const stats: Stat[] = [
    {
      icon: Users,
      value: yearStatistics?.uniqueRunners.total,
      label: "deltakere totalt",
    },
    {
      icon: ChartColumnIncreasing,
      value: yearStatistics?.averageRunnersPerRace.toFixed(1),
      label: "snittdeltakelse",
    },
    {
      icon: Venus,
      value: yearStatistics?.uniqueRunners.female,
      label: "damer",
    },
    {
      icon: Mars,
      value: yearStatistics?.uniqueRunners.male,
      label: "herrer",
    },
    {
      icon: Footprints,
      value: yearStatistics?.completedRaces,
      label: "løp gjennomført",
    },
    {
      icon: SportShoe,
      value: yearStatistics?.upcomingRaces,
      label: "gjenstående løp",
    },
  ];

  return (
    <Card className="gap-4 py-5">
      <h2 className="px-6 text-sm font-bold uppercase tracking-wide text-[#173d2b]">
        Årets sesong i tall
      </h2>
      <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
        {stats.map(({ icon: Icon, value, label }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 bg-card px-2 py-4 text-center"
          >
            <Icon className="size-7 text-[#2f7d4c]" strokeWidth={2} />
            <p className="text-2xl font-bold tabular-nums text-gray-900">
              {value ?? "–"}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              {label}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
