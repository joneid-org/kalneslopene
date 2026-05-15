import RaceStatistics from "@/components/Statistics/RaceStatistics.tsx";
import RunnerStatistics from "@/components/Statistics/RunnerStatistics.tsx";

export function Statistics() {
  return (
    <div className="page-content">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        <div className="flex-1 min-w-0">
          <RaceStatistics />
        </div>
        <div className="h-px lg:h-auto lg:w-px bg-border self-stretch" />
        <div className="flex-1 min-w-0">
          <RunnerStatistics />
        </div>
      </div>
    </div>
  );
}
