import RaceStatistics from "@/components/Statistics/RaceStatistics.tsx";
import RunnerStatistics from "@/components/Statistics/RunnerStatistics.tsx";

export function Statistics() {
  return (
    <div className="page-content">
      <div className="flex flex-col gap-8 md:grid md:grid-cols-[1fr_1.3fr] md:items-start md:gap-6">
        <RaceStatistics />
        <RunnerStatistics />
      </div>
    </div>
  );
}
