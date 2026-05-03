import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import {
  getNumberOfUniqueRunnersThisYear,
  getRacesHeldThisYear,
  getRacesLeftThisYear,
  getUniqueRunnersByGenderThisYear,
} from "@/lib/statisticsUtils.ts";

export default function SeasonStatBoxes() {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const year = new Date().getFullYear();
  const allRaces = races ?? [];

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

  const stats = [
    {
      value: getNumberOfUniqueRunnersThisYear(rr, year),
      label: "deltakere totalt",
    },
    { value: getUniqueRunnersByGenderThisYear(rr, year, "f"), label: "damer" },
    { value: getUniqueRunnersByGenderThisYear(rr, year, "m"), label: "herrer" },
    { value: getRacesHeldThisYear(allRaces, year), label: "løp gjennomført" },
    { value: getRacesLeftThisYear(allRaces, year), label: "gjenstående løp" },
  ];

  return (
    <div className="rounded-md bg-[#173d2b] p-2">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="rounded-md p-3 flex flex-col justify-between items-center text-center">
          <p className="text-xs text-white uppercase">Deltakerstatistikk</p>
          <p className="text-xl text-white font-semibold">
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
            <p className="text-xs font-semibold uppercase tracking-wide">
              {label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
