import { useQuery } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import { cn, getRacesDTOByYear, getYears } from "@/lib/utils.ts";

type RacePickerDrawerProps = {
  children: ReactNode;
  basePath?: string;
};

export function RacePickerDrawer({
  children,
  basePath = "/Resultater",
}: RacePickerDrawerProps) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const years = getYears(races ?? []);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const activeYear = selectedYear ?? years[0];

  return (
    <Drawer>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle className="font-display text-lg font-extrabold tracking-tight">
            Velg løp
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex shrink-0 gap-2 overflow-x-auto px-4 pb-3 mb-2">
          {years.map((year) => (
            <button
              key={year}
              type="button"
              onClick={() => setSelectedYear(year)}
              className={cn(
                "shrink-0 rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                year === activeYear
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent",
              )}
            >
              {year}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-3 gap-2 overflow-y-auto px-4 mt-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          {getRacesDTOByYear(races ?? [], activeYear).map((race) => (
            <DrawerClose key={race.uuid} asChild>
              <Link
                to={`${basePath}/${race.uuid}`}
                className="rounded-xl border bg-card px-1 py-3 text-center text-sm font-semibold whitespace-no text-foreground/80 transition-colors hover:bg-accent"
              >
                {formatDDMonth(race.raceDate)}
              </Link>
            </DrawerClose>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
