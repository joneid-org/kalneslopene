import { useQuery } from "@tanstack/react-query";
import type { Ref } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { DynamicDropDownMenu } from "@/components/Navbar/DynamicDropDownMenu.tsx";
import MobileNavBarMenu from "@/components/Navbar/MobileNavBarMenu.tsx";
import { Button } from "@/components/ui/button.tsx";

const headerBarDynamic = [
  { path: "/Resultater", label: "Resultater" },
  { path: "/Bilder", label: "Bilder" },
];
const headerBarStatic = [
  { path: "/Statistikk", label: "Statistikk" },
  { path: "/Løypekart", label: "Løypekart" },
  { path: "/Historie", label: "Historie" },
];

export function Header({ ref }: { ref?: Ref<HTMLElement> }) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces());

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
              <svg
                viewBox="0 0 100 100"
                className="size-8 shrink-0 transition-transform group-hover:scale-105"
                aria-hidden="true"
              >
                <rect
                  x="4"
                  y="4"
                  width="92"
                  height="92"
                  rx="26"
                  fill="#1f7a4d"
                />
                <path
                  d="M27 80 C 27 57, 51 60, 51 41 C 51 25, 75 29, 75 17"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <circle cx="27" cy="80" r="8" fill="#fff" />
                <circle cx="75" cy="17" r="9" fill="#f2a33c" />
              </svg>
              <div className="min-w-0 leading-tight">
                <h1 className="font-display font-extrabold text-sm text-foreground truncate leading-tight tracking-tight">
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
}
