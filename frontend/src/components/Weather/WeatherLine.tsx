import type { LucideIcon } from "lucide-react";
import { Footprints } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { weatherItems } from "@/lib/weatherDisplay.ts";
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
      {Object.entries(weatherItems(weather)).map(
        ([key, item]) =>
          item && (
            <Item key={key} icon={item.icon}>
              {item.text}
            </Item>
          ),
      )}
      {courseCondition && <Item icon={Footprints}>{courseCondition}</Item>}
    </span>
  );
}
