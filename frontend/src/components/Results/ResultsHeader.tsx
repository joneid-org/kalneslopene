import { WeatherLine } from "@/components/Weather/WeatherLine.tsx";
import type { RaceDTO } from "@/model/DTO.ts";

type ResultsHeaderProps = {
  race: RaceDTO;
  title?: string;
};

export default function ResultsHeader({ race, title }: ResultsHeaderProps) {
  const cover = race.photos[0];
  if (!cover) return null;

  return (
    <div className="relative hidden h-60 w-full overflow-hidden rounded-2xl md:block">
      <img
        src={cover.url}
        alt={cover.description ?? ""}
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-brand-ink/80 via-brand-ink/10 to-transparent" />
      <div className="absolute bottom-0 left-0 px-7 pb-6 text-white">
        <div className="font-display text-3xl font-black leading-none tracking-tight">
          {title}
        </div>
        <WeatherLine
          weather={race.weather}
          courseCondition={race.courseCondition}
          className="mt-1.5 text-white/85"
        />
      </div>
    </div>
  );
}
