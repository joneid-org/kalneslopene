import { CalendarIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { getBestRaceThisYearFromRunner } from "@/lib/utils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

type Props = {
  availableYears: number[];
  raceHistory: RaceRunnerDTO[];
};

export default function RunnerStatisticsSeasonBest({
  availableYears,
  raceHistory,
}: Props) {
  if (availableYears.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="size-4 text-primary" />
          Sesongbeste
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {availableYears.map((year, idx) => (
            <li
              key={year}
              className={`flex items-center justify-between px-6 py-3 ${idx === 0 ? "bg-primary/5" : ""}`}
            >
              <span
                className={`text-sm font-medium ${idx === 0 ? "text-primary" : ""}`}
              >
                {year}
              </span>
              <span className="tabular-nums text-sm font-mono font-semibold">
                {getBestRaceThisYearFromRunner(raceHistory, year)}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
