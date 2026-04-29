import { useQuery } from "@tanstack/react-query";
import { CalendarCheck, CalendarClock, Mars, Users, Venus } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { getNumberOfUniqueRunnersThisYear } from "@/lib/statisticsUtils.ts";
import { extractYear } from "@/lib/timeUtils.ts";

export default function SeasonStatBoxes() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const year = new Date().getFullYear();
  const allRaces = races ?? [];

  const racesHeld = allRaces.filter((r) => {
    const d = new Date(r.raceDate);
    return extractYear(r.raceDate) === year && d <= new Date();
  }).length;

  const racesLeft = allRaces.filter((r) => {
    const d = new Date(r.raceDate);
    return extractYear(r.raceDate) === year && d > new Date();
  }).length;

  const { data: raceRunners } = useQuery({
    queryKey: ["raceRunners", "all"],
    queryFn: async () => {
      const results = await Promise.all(
        (races ?? []).map((r) =>
          QUERIES.race.getAllRunnersInRace(r.uuid ?? "").queryFn(),
        ),
      );
      return results.flat();
    },
    enabled: !!races && races.length > 0,
  });

  const rr = raceRunners ?? [];
  const totalRunners = getNumberOfUniqueRunnersThisYear(rr, year);
  const women = new Set(
    rr
      .filter(
        (r) =>
          extractYear(r.race.raceDate) === year &&
          r.runner.gender?.toLowerCase() === "f",
      )
      .map((r) => r.runner.uuid),
  ).size;
  const men = new Set(
    rr
      .filter(
        (r) =>
          extractYear(r.race.raceDate) === year &&
          r.runner.gender?.toLowerCase() === "m",
      )
      .map((r) => r.runner.uuid),
  ).size;

  const stats = [
    // {
    //   value: "Deltakerstatistikk",
    //   label: "Årets sesong i tall",
    // },
    {
      icon: Users,
      value: totalRunners,
      label: "deltakere totalt",
      color: "text-blue-500",
    },
    { icon: Venus, value: women, label: "damer", color: "text-pink-500" },
    { icon: Mars, value: men, label: "herrer", color: "text-indigo-500" },
    {
      icon: CalendarCheck,
      value: racesHeld,
      label: "løp gjennomført",
      color: "text-emerald-500",
    },
    {
      icon: CalendarClock,
      value: racesLeft,
      label: "gjenstående løp",
      color: "text-orange-500",
    },
  ];

  return (
    <div className="rounded-md bg-linear-to-br bg-[#173d2b] p-2 flex flex-col gap-3">
      {/* 2×3 grid of white stat cards */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-[#173d2b] rounded-md p-3 flex flex-col justify-between items-center text-center">
          <p className="text-xs text-white tabular-nums uppercase">
            Deltakerstatistikk
          </p>
          <p className="text-xl text-white font-semibold ">
            Årets sesong i tall
          </p>
        </div>
        {stats.map(({ value, label }) => (
          <div
            key={label}
            className="bg-white rounded-md p-3 flex flex-col justify-between items-center text-center"
          >
            <p className="text-xl font-black tabular-nums text-gray-900">
              {value ?? "–"}
            </p>
            <p className="text-xs font-semibold uppercase tracking-wide ">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
