import { useQuery } from "@tanstack/react-query";
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
      <div className="flex items-center container mx-auto px-4 py-3">
        <div className="md:hidden pr-2">
          <MobileNavBarMenu
            headerBarDynamic={headerBarDynamic}
            headerBarStatic={headerBarStatic}
            races={races ?? []}
          />
        </div>

        <div className="flex container justify-between items-center">
          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2.5 group select-none">
            {/* SVG logo mark — runner in a circle */}
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0 transition-transform group-hover:scale-105"
              aria-hidden="true"
            >
              {/* Circle background */}
              <circle cx="18" cy="18" r="18" fill="#2563EB" />
              {/* Runner silhouette — forward-leaning sprinter */}
              {/* Head */}
              <circle cx="22" cy="8.5" r="2.3" fill="white" />
              {/* Torso — leaning forward */}
              <line
                x1="21"
                y1="10.5"
                x2="16"
                y2="17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Left arm — pumping forward */}
              <line
                x1="19.5"
                y1="13"
                x2="23.5"
                y2="16.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right arm — driving back */}
              <line
                x1="19"
                y1="13.5"
                x2="14.5"
                y2="11.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Left leg — stride forward */}
              <line
                x1="16"
                y1="17"
                x2="21.5"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="21.5"
                y1="23"
                x2="24.5"
                y2="27.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Right leg — push off behind */}
              <line
                x1="16"
                y1="17"
                x2="12.5"
                y2="23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="12.5"
                y1="23"
                x2="11"
                y2="27.5"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>

            {/* Wordmark */}
            <div className="flex flex-col leading-tight">
              <span className="text-base font-black text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors">
                Torsdags<span className="text-blue-600">løpet</span>
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-widest text-gray-400">
                Kalnesskogen · siden 1978
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
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
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
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
