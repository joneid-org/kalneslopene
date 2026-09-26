import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { StatCard } from "@/components/Statistics/StatCard.tsx";
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import {
  extractYear,
  formatDDMMYYYY,
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

const YEAR_COLORS: Record<number, string> = {
  2026: "oklch(0.50 0.18 255)",
  2025: "oklch(0.55 0.16 152)",
  2024: "oklch(0.65 0.19 55)",
  2023: "oklch(0.60 0.15 285)",
};
const FALLBACK = [
  "oklch(0.50 0.18 255)",
  "oklch(0.55 0.16 152)",
  "oklch(0.65 0.19 55)",
];

const yearColor = (year: number, index: number) =>
  YEAR_COLORS[year] ?? FALLBACK[index % FALLBACK.length];

type ChartPoint = {
  label: string;
  sortKey: string;
  [year: string]: number | string;
};

type Props = {
  raceHistory: RaceRunnerDTO[];
  availableYears: number[];
  selectedYears: number[];
};

export default function RunnerTimeChart({
  raceHistory,
  availableYears,
  selectedYears,
}: Props) {
  const selectedYearsSet = new Set(selectedYears);

  const filtered = raceHistory.filter(
    (rr) =>
      selectedYearsSet.has(extractYear(rr.raceInfo.raceDate)) &&
      !rr.hideTime &&
      rr.resultTime,
  );

  const byDate = new Map<string, ChartPoint>();
  for (const rr of filtered) {
    const { raceDate } = rr.raceInfo;
    const key = raceDate;
    const label = formatDDMonth(raceDate);
    const year = extractYear(raceDate);
    if (!byDate.has(key)) byDate.set(key, { label, sortKey: key });
    const point = byDate.get(key);
    if (point) point[String(year)] = mapResultTimeToNumber(rr.resultTime);
  }

  const points = Array.from(byDate.values()).toSorted((a, b) =>
    a.sortKey.localeCompare(b.sortKey),
  );

  const chartConfig: ChartConfig = Object.fromEntries(
    availableYears.map((y, i) => [
      String(y),
      { label: String(y), color: yearColor(y, i) },
    ]),
  );

  return (
    <StatCard
      title="Utvikling over tid"
      subtitle="Trykk på et punkt for å se tiden"
    >
      {points.length < 2 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
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
              tickFormatter={formatSecondsToTime}
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={44}
              domain={["auto", "auto"]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(_label, payload) => {
                    const sortKey = payload?.[0]?.payload?.sortKey;
                    return sortKey ? formatDDMMYYYY(sortKey) : "";
                  }}
                  formatter={(value) => (
                    <span className="font-mono font-medium tabular-nums">
                      {formatSecondsToTime(Number(value))}
                    </span>
                  )}
                />
              }
            />
            {selectedYears.length > 1 && (
              <ChartLegend content={<ChartLegendContent />} />
            )}
            {selectedYears.map((y) => {
              const color = yearColor(y, availableYears.indexOf(y));
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
    </StatCard>
  );
}
