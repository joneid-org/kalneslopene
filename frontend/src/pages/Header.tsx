import { useQuery } from "@tanstack/react-query";
import { Footprints } from "lucide-react";
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
      <div className="flex items-center container mx-auto px-4 py-2">
        <div className="md:hidden pr-2">
          <MobileNavBarMenu
            headerBarDynamic={headerBarDynamic}
            headerBarStatic={headerBarStatic}
            races={races ?? []}
          />
        </div>

        <div className={"flex container justify-between items-center"}>
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="relative flex items-center justify-center size-8 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 text-white shadow-sm group-hover:shadow-blue-300 group-hover:scale-105 transition-all shrink-0">
                <Footprints className="size-4 rotate-12" />
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-yellow-400 border border-white" />
              </div>
              <div className="min-w-0 leading-tight md:hidden">
                <h1 className="font-black text-sm text-gray-900 truncate leading-tight tracking-tight">
                  Torsdagsløpet
                </h1>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex gap-0.5 items-center">
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
                <Button variant={"ghost"} size="sm">
                  {label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
});
