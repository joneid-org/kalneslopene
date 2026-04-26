import RaceStatistics from "@/components/RaceStatistics.tsx";
import RunnerStatistics from "@/components/RunnerStatistics.tsx";

export function Statistikk() {
  return (
    <div className="w-full sm:max-w-[75vw] lg:max-w-[90vw] mx-auto px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
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
