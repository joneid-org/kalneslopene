import { ChevronDown } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
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
import { getDayAndMonth } from "@/lib/timeUtils.ts";
import { getRacesDTOByYear, getYears } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type MenuBarDropDownButtonProps = {
  label: string;
  basePath: string;
  races: RaceDTO[];
};

export function DynamicDropDownMenu({
  races,
  label,
  basePath,
}: MenuBarDropDownButtonProps) {
  const years: number[] = getYears(races);

  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-1">
            {label}
            <ChevronDown className="size-3.5 opacity-60" />
          </Button>
        </MenubarTrigger>

        <MenubarContent>
          {years.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent>
                {getRacesDTOByYear(races, year).map((race) => (
                  <MenubarItem key={race.uuid} asChild>
                    <Link to={`${basePath}/${race.uuid}`}>
                      {getDayAndMonth(race.raceDate)}
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
