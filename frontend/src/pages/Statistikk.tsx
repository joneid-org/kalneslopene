import RaceStatistics from "@/components/RaceStatistics.tsx";
import RunnerStatistics from "@/components/RunnerStatistics.tsx";

export function Statistikk() {
  return (
    <div className="page-content">
      <div className="flex flex-col lg:flex-row gap-8 lg:items-start">
        <div className="flex-1 min-w-0">
          <RaceStatistics />
        </div>
        <div className="hidden lg:block w-px bg-border self-stretch" />
        <div className="block lg:hidden h-px bg-border" />
        <div className="flex-1 min-w-0">
          <RunnerStatistics />
        </div>
      </div>
    </div>
  );
}
