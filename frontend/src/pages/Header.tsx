import { useQuery } from "@tanstack/react-query";
import { forwardRef } from "react";
import { Link, useLocation } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { DynamicDropDownMenu } from "@/components/DynamicDropDownMenu.tsx";
import MobileNavBarMenu from "@/components/MobileNavBarMenu.tsx";

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
  const location = useLocation();

  return (
    <header
      ref={ref}
      className="border-b bg-white/95 backdrop-blur sticky top-0 z-50 shadow-sm"
    >
      <div className="flex items-center max-w-7xl mx-auto px-4 py-3">
        <div className="md:hidden pr-2">
          <MobileNavBarMenu
            headerBarDynamic={headerBarDynamic}
            headerBarStatic={headerBarStatic}
            races={races ?? []}
          />
        </div>

        <div className="flex w-full justify-between items-center">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="size-8 rounded-full bg-blue-600 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-blue-700 transition-colors">
              <span className="text-white font-bold text-xs">TL</span>
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-gray-900 truncate tracking-tight">
                Torsdagsløpet
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex gap-0.5 items-center">
            {headerBarDynamic.map(({ path, label }) => (
              <DynamicDropDownMenu
                key={label}
                label={label}
                basePath={path}
                races={races ?? []}
              />
            ))}
            {headerBarStatic.map(({ path, label }) => {
              const isActive = location.pathname.startsWith(path);
              return (
                <Link
                  key={label}
                  to={path}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
});
