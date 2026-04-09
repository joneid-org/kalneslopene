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
} from "@/components/ui/menubar";
import { formatDDMonth } from "@/lib/timeUtils.ts";
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
        <MenubarTrigger className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md cursor-pointer data-[state=open]:bg-gray-100 data-[state=open]:text-gray-900 flex items-center gap-1 border-0 bg-transparent shadow-none focus:ring-0">
          {label}
          <ChevronDown className="size-3.5 opacity-60" />
        </MenubarTrigger>

        <MenubarContent>
          {years.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent>
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
