import { MenuIcon, X as XIcon } from "lucide-react";
import { Link } from "react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { getAllRacesByYear, formatDateMonthDisplay } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export interface MobileNavBarMenuProps {
  headerBarDynamic: { path: string; label: string }[];
  headerBarStatic: { path: string; label: string }[];
  years: number[];
  races: RaceDTO[] | undefined;
}

export default function MobileNavBarMenu({
  headerBarDynamic,
  headerBarStatic,
  years,
  races,
}: MobileNavBarMenuProps) {
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant={"outline"} size={"icon"}>
          <MenuIcon />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="flex flex-col overflow-y-auto">
        <DrawerHeader className="flex items-end border-b pb-3">
          <DrawerClose asChild>
            <XIcon />
          </DrawerClose>
        </DrawerHeader>

        <nav className="px-4 py-2 flex-1 overflow-y-auto">
          <Accordion type="multiple">
            {headerBarDynamic.map(({ path: basePath, label }) => (
              <AccordionItem key={label} value={label}>
                <AccordionTrigger className="text-base font-medium">
                  {label}
                </AccordionTrigger>
                <AccordionContent>
                  <Accordion type="multiple" className="pl-3">
                    {years.map((year) => (
                      <AccordionItem key={year} value={String(year)}>
                        <AccordionTrigger className="text-sm">
                          {year}
                        </AccordionTrigger>
                        <AccordionContent className="pl-3 flex flex-col">
                          {getAllRacesByYear(year, races).map((race) => (
                            <DrawerClose asChild key={race}>
                              <Link
                                to={`${basePath}/${year}/${race}`}
                                className="py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                              >
                                {formatDateMonthDisplay(race)}
                              </Link>
                            </DrawerClose>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}

            {headerBarStatic.map(({ path, label }) => (
              <div key={label} className="border-b last:border-b-0 py-4">
                <DrawerClose asChild>
                  <Link
                    to={path}
                    className="text-base font-medium hover:underline"
                  >
                    {label}
                  </Link>
                </DrawerClose>
              </div>
            ))}
          </Accordion>
        </nav>
      </DrawerContent>
    </Drawer>
  );
}
