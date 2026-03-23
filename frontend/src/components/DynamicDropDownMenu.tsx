import { Link } from "react-router";
import { Button } from "@/components/ui/button";
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
import { getAllRacesByYear, formatDateMonthDisplay } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

type MenuBarDropDownButtonProps = {
  label: string;
  basePath: string;
  years: number[];
  races: RaceDTO[] | undefined;
};

export function DynamicDropDownMenu({
  years,
  label,
  basePath,
  races,
}: MenuBarDropDownButtonProps) {
  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="outline">{label}</Button>
        </MenubarTrigger>

        <MenubarContent>
          {years.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent>
                {getAllRacesByYear(year, races).map((race) => (
                  <MenubarItem key={race} asChild>
                    <Link to={`${basePath}/${year}/${race}`}>
                      {formatDateMonthDisplay(race)}
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
