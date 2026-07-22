import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";
import { formatDDMonth } from "@/lib/timeUtils.ts";
import { cn, getRacesDTOByYear, getYears } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type MenuBarDropDownButtonProps = {
  label: string;
  basePath: string;
  races: RaceDTO[];
  active?: boolean;
};

export function DynamicDropDownMenu({
  races,
  label,
  basePath,
  active = false,
}: MenuBarDropDownButtonProps) {
  const years: number[] = getYears(races);

  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger
          className={cn(
            "flex cursor-pointer items-center gap-1.5 rounded-[11px] px-3.5 py-2 text-[15px] font-semibold transition-colors",
            active
              ? "bg-secondary text-secondary-foreground"
              : "text-foreground hover:bg-accent",
          )}
        >
          {label}
          <ChevronDown className="size-3.5" />
        </MenubarTrigger>

        <MenubarContent className="max-h-[calc(var(--radix-menubar-content-available-height)*0.8)] overflow-y-auto scroll-fade-edges">
          {years.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent className="max-h-[calc(var(--radix-menubar-content-available-height)*0.8)] overflow-y-auto scroll-fade-edges">
                {getRacesDTOByYear(races, year).map((race) => (
                  <MenubarItem key={race.uuid} asChild>
                    <Link to={`${basePath}/${race.uuid}`}>
                      {formatDDMonth(race.raceDate)}
                    </Link>
                  </MenubarItem>
                ))}
              </MenubarSubContent>
            </MenubarSub>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
