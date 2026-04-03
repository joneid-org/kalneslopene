import { useQuery } from "@tanstack/react-query";
import { HomeIcon } from "lucide-react";
import { forwardRef } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { DynamicDropDownMenu } from "@/components/DynamicDropDownMenu.tsx";
import MobileNavBarMenu from "@/components/MobileNavBarMenu.tsx";
import { Button } from "@/components/ui/button.tsx";

const headerBarDynamic = [
  { path: "/Resultater", label: "Resultater" },
  { path: "/Bilder", label: "Bilder" },
];
const headerBarStatic = [
  { path: "/Statistikk", label: "Statistikk" },
  { path: "/PersonligeRekorder", label: "Rekorder" },
  { path: "/Løypekart", label: "Løypekart" },
  { path: "/Historie", label: "Historie" },
];

export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  return (
    <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center container mx-auto px-4 py-4">
        <div className="md:hidden pr-2">
          <MobileNavBarMenu
            headerBarDynamic={headerBarDynamic}
            headerBarStatic={headerBarStatic}
            races={races ?? []}
          />
        </div>

        <div className={"flex container justify-between"}>
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-2">
              <Button variant={"outline"} size={"icon"}>
                <HomeIcon />
              </Button>
              <div className="min-w-0">
                <h1 className="font-bold truncate">Torsdagsløpet</h1>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex gap-1 items-center">
            {headerBarDynamic.map(({ path, label }) => (
              <DynamicDropDownMenu
                key={label}
                label={label}
                basePath={path}
                races={races ?? []}
              />
            ))}
            {headerBarStatic.map(({ path, label }) => (
              <Link key={label} to={path}>
                <Button variant={"outline"}>{label}</Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
});
