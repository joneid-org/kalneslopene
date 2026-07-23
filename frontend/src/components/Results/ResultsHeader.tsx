import type { RaceDTO } from "@/model/DTO.ts";

type ResultsHeaderProps = {
  race: RaceDTO;
};

export default function ResultsHeader({ race }: ResultsHeaderProps) {
  const cover = race.photos[0];
  if (!cover) return null;

  return (
    <div className="relative hidden h-60 w-full overflow-hidden rounded-2xl md:block">
      <img
        src={cover.url}
        alt={cover.description ?? ""}
        className="absolute inset-0 size-full object-cover"
      />
    </div>
  );
}
