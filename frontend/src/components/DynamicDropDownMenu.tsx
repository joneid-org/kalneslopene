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
import { getRacesByYear, getYears } from "@/lib/utils.ts";
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
          <Button variant="outline">{label}</Button>
        </MenubarTrigger>

        <MenubarContent>
          {years.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent>
                {getRacesByYear(races, year).map((date) => (
                  <MenubarItem key={`${year}-${date}`} asChild>
                    <Link to={`${basePath}/${year}/${date}`}>{date}</Link>
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
