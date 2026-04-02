import RaceStatistics from "@/components/RaceStatistics.tsx";
import RunnerStatistics from "@/components/RunnerStatistics.tsx";
import { Separator } from "@/components/ui/separator.tsx";

export function Statistikk() {
  return (
    <div className="px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8 max-w-3xl mx-auto space-y-10">
      <RaceStatistics />
      <Separator />
      <RunnerStatistics />
    </div>
  );
}
