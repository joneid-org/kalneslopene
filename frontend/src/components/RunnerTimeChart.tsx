import { TrendingUpIcon } from "lucide-react";
import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import { getRunnerChartData } from "@/data/mockdata.ts";

const YEAR_COLORS: Record<number, string> = {
  2026: "oklch(0.50 0.18 255)", // blue
  2025: "oklch(0.55 0.16 152)", // green
  2024: "oklch(0.65 0.19 55)", // orange
  2023: "oklch(0.60 0.15 285)", // purple
};
const FALLBACK = [
  "oklch(0.50 0.18 255)",
  "oklch(0.55 0.16 152)",
  "oklch(0.65 0.19 55)",
];

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const currentYear = new Date().getFullYear();

type Props = { runnerId: string; availableYears: number[] };

export default function RunnerTimeChart({ runnerId, availableYears }: Props) {
  const [selectedYears, setSelectedYears] = useState<number[]>(() =>
    availableYears.includes(currentYear)
      ? [currentYear]
      : availableYears.slice(0, 1),
  );

  const toggleYear = (y: number) =>
    setSelectedYears((prev) =>
      prev.includes(y)
        ? prev.length > 1
          ? prev.filter((x) => x !== y)
          : prev
        : [...prev, y],
    );

  const toggleAll = () =>
    setSelectedYears(
      selectedYears.length === availableYears.length
        ? [availableYears[0]]
        : [...availableYears],
    );

  const { points } = getRunnerChartData(runnerId, selectedYears);

  const chartConfig: ChartConfig = Object.fromEntries(
    availableYears.map((y, i) => [
      String(y),
      {
        label: String(y),
        color: YEAR_COLORS[y] ?? FALLBACK[i % FALLBACK.length],
      },
    ]),
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUpIcon className="size-4 text-primary" />
            Utvikling over tid
          </CardTitle>

          <div className="flex flex-wrap gap-1.5">
            <Button
              size="sm"
              variant={
                selectedYears.length === availableYears.length
                  ? "default"
                  : "outline"
              }
              onClick={toggleAll}
              className="text-xs h-7 px-2.5"
            >
              Alle
            </Button>
            {availableYears.map((y, i) => {
              const color = YEAR_COLORS[y] ?? FALLBACK[i % FALLBACK.length];
              const active = selectedYears.includes(y);
              return (
                <Button
                  key={y}
                  size="sm"
                  variant={active ? "default" : "outline"}
                  onClick={() => toggleYear(y)}
                  className="text-xs h-7 px-2.5"
                  style={
                    active
                      ? {
                          backgroundColor: color,
                          borderColor: color,
                          color: "white",
                        }
                      : {}
                  }
                >
                  {y}
                </Button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {points.length < 2 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            Ikke nok data for valgte sesonger.
          </p>
        ) : (
          <ChartContainer config={chartConfig} className="h-56 w-full">
            <LineChart
              data={points}
              margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={fmt}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={44}
                domain={["auto", "auto"]}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    formatter={(value, name) => [
                      fmt(Number(value)),
                      chartConfig[String(name)]?.label ?? String(name),
                    ]}
                  />
                }
              />
              {selectedYears.map((y, i) => {
                const color = YEAR_COLORS[y] ?? FALLBACK[i % FALLBACK.length];
                return (
                  <Line
                    key={y}
                    type="monotone"
                    dataKey={String(y)}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3, fill: color }}
                    activeDot={{ r: 5 }}
                    connectNulls={false}
                  />
                );
              })}
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
