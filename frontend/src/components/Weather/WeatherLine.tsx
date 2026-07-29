import type { LucideIcon } from "lucide-react";
import { Compass, Footprints, Thermometer, Wind } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import {
  weatherIcon,
  weatherLabel,
  windDirectionLabel,
} from "@/lib/weatherDisplay.ts";
import type { WeatherDto } from "@/model/DTO.ts";

function Item({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <Icon className="size-4 shrink-0 opacity-80" />
      {children}
    </span>
  );
}

/**
 * Compact inline weather + course-condition summary shared by the historical race views.
 * Renders nothing when there is no data to show.
 */
export function WeatherLine({
  weather,
  courseCondition,
  className,
}: {
  weather?: WeatherDto;
  courseCondition?: string;
  className?: string;
}) {
  if (!weather && !courseCondition) return null;

  return (
    <span
      className={cn(
        "inline-flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm",
        className,
      )}
    >
      {weather && (
        <>
          <Item icon={weatherIcon(weather.symbol)}>
            {weatherLabel(weather.symbol)}
          </Item>
          <Item icon={Thermometer}>{weather.temperature}°C</Item>
          <Item icon={Wind}>{weather.windSpeed} m/s</Item>
          {weather.windDirection != null && (
            <Item icon={Compass}>
              {windDirectionLabel(weather.windDirection)}
            </Item>
          )}
        </>
      )}
      {courseCondition && <Item icon={Footprints}>{courseCondition}</Item>}
    </span>
  );
}
