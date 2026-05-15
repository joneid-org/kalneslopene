import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { getDayAndMonth, getYear } from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function CsvRaceSelector({
  races,
  selected,
  onSelect,
  onNext,
}: {
  races: RaceDTO[];
  selected: RaceDTO | null;
  onSelect: (race: RaceDTO) => void;
  onNext: () => void;
}) {
  const sorted = [...races].sort((a, b) =>
    b.raceDate.localeCompare(a.raceDate),
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground italic p-4">
              Ingen gjennomførte løp funnet.
            </p>
          )}
          <div className="divide-y">
            {sorted.map((race) => {
              const isSelected = selected?.uuid === race.uuid;
              return (
                <button
                  key={race.uuid}
                  type="button"
                  onClick={() => onSelect(race)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <CalendarIcon
                    className={`size-4 shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                  />
                  <span className="font-medium">
                    {getDayAndMonth(race.raceDate)}{" "}
                    <span className="text-muted-foreground font-normal text-sm">
                      {getYear(race.raceDate)}
                    </span>
                  </span>
                  {isSelected && (
                    <span className="ml-auto text-xs font-semibold text-primary">
                      Valgt
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Button className="ml-auto block" disabled={!selected} onClick={onNext}>
        Neste
      </Button>
    </div>
  );
}
