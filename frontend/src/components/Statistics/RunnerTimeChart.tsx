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
import type { YearValue } from "@/components/YearSelector.tsx";
import {
  extractYear,
  formatDDMMYYYY,
  formatDDMonth,
  formatSecondsToTime,
  mapResultTimeToNumber,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceRunnerDTO } from "@/model/DTO.ts";

const seasonConfig = {
  time: { label: "Tid", color: "var(--chart-1)" },
} satisfies ChartConfig;

const allSeasonsConfig = {
  best: { label: "Sesongbeste", color: "var(--chart-1)" },
  average: { label: "Snittid", color: "var(--chart-2)" },
} satisfies ChartConfig;

type ChartPoint = {
  label: string;
  tooltipLabel: string;
  [series: string]: number | string;
};

function seasonPoints(timed: RaceRunnerDTO[], year: number): ChartPoint[] {
  return timed
    .filter((rr) => extractYear(rr.raceInfo.raceDate) === year)
    .toSorted((a, b) =>
      raceDateToSortKey(a.raceInfo.raceDate).localeCompare(
        raceDateToSortKey(b.raceInfo.raceDate),
      ),
    )
    .map((rr) => ({
      label: formatDDMonth(rr.raceInfo.raceDate),
      tooltipLabel: formatDDMMYYYY(rr.raceInfo.raceDate),
      time: mapResultTimeToNumber(rr.resultTime),
    }));
}

function allSeasonsPoints(
  timed: RaceRunnerDTO[],
  years: number[],
): ChartPoint[] {
  return years
    .toSorted((a, b) => a - b)
    .flatMap((year) => {
      const seconds = timed
        .filter((rr) => extractYear(rr.raceInfo.raceDate) === year)
        .map((rr) => mapResultTimeToNumber(rr.resultTime));
      if (seconds.length === 0) return [];
      return {
        label: String(year),
        tooltipLabel: `Sesongen ${year}`,
        best: Math.min(...seconds),
        average: seconds.reduce((sum, s) => sum + s, 0) / seconds.length,
      };
    });
}

type Props = {
  raceHistory: RaceRunnerDTO[];
  availableYears: number[];
  season: YearValue;
};

export default function RunnerTimeChart({
  raceHistory,
  availableYears,
  season,
}: Props) {
  const isAllSeasons = season === "all";
  const timed = raceHistory.filter((rr) => !rr.hideTime && rr.resultTime);
  const points = isAllSeasons
    ? allSeasonsPoints(timed, availableYears)
    : seasonPoints(timed, season);
  const config: ChartConfig = isAllSeasons ? allSeasonsConfig : seasonConfig;

  return (
    <StatCard
      title={
        isAllSeasons ? "Utvikling fra år til år" : "Tider gjennom sesongen"
      }
      subtitle="Trykk på et punkt for å se tiden"
    >
      {points.length < 2 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          Ikke nok data for valgt sesong.
        </p>
      ) : (
        <ChartContainer config={config} className="h-56 w-full">
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
              interval={isAllSeasons ? 0 : "preserveStartEnd"}
              minTickGap={16}
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
                  labelFormatter={(_label, payload) =>
                    payload?.[0]?.payload?.tooltipLabel ?? ""
                  }
                  formatter={(value, name) => (
                    <div className="flex w-full justify-between gap-3">
                      <span className="text-muted-foreground">
                        {config[String(name)]?.label}
                      </span>
                      <span className="font-mono font-medium tabular-nums">
                        {formatSecondsToTime(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            {isAllSeasons && <ChartLegend content={<ChartLegendContent />} />}
            {Object.keys(config).map((series) => (
              <Line
                key={series}
                type="monotone"
                dataKey={series}
                stroke={`var(--color-${series})`}
                strokeWidth={2}
                dot={{ r: 3, fill: `var(--color-${series})` }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        </ChartContainer>
      )}
    </StatCard>
  );
}
