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
import { getRacesByYear } from "@/data/mockdata.ts";

type MenuBarDropDownButtonProps = {
  label: string;
  basePath: string; // e.g. "/Resultater" or "/Bilder"
  submenu1: number[]; // years
};

export function DynamicDropDownMenu({
  submenu1,
  label,
  basePath,
}: MenuBarDropDownButtonProps) {
  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="outline">{label}</Button>
        </MenubarTrigger>

        <MenubarContent>
          {submenu1.map((year) => (
            <MenubarSub key={year}>
              <MenubarSubTrigger>{year}</MenubarSubTrigger>

              <MenubarSubContent>
                {getRacesByYear(year).map((race) => (
                  <MenubarItem key={race.id} asChild>
                    <Link to={`${basePath}/${year}/${race.week}`}>
                      {race.date}
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
