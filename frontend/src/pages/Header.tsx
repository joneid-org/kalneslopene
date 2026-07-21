import { useQuery } from "@tanstack/react-query";
import type { Ref } from "react";
import { Link, useLocation } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { DynamicDropDownMenu } from "@/components/Navbar/DynamicDropDownMenu.tsx";
import { cn } from "@/lib/utils.ts";

const navLinks = [
  { path: "/statistikk", label: "Statistikk" },
  { path: "/løypekart", label: "Løypekart" },
  { path: "/historie", label: "Historie" },
];

export function Header({ ref }: { ref?: Ref<HTMLElement> }) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const pathname = decodeURIComponent(useLocation().pathname);

  return (
    <header ref={ref} className="sticky top-0 z-50 bg-card/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 w-full max-w-[var(--page-max-width)] items-center gap-3 px-4 md:h-[70px]">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <svg
            viewBox="0 0 100 100"
            className="size-8 shrink-0 transition-transform group-hover:scale-105"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="92" height="92" rx="26" fill="#1f7a4d" />
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
          <span className="truncate font-display text-[17px] font-extrabold tracking-tight md:text-lg">
            Torsdagsløpet
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          <DynamicDropDownMenu
            label="Resultater"
            basePath="/resultater"
            races={(races ?? []).filter((r) => r.isPublished)}
            active={pathname.startsWith("/resultater")}
          />
          {navLinks.map(({ path, label }) => {
            const active = pathname.startsWith(path);
            return (
              <Link
                key={path}
                to={path}
                className={cn(
                  "rounded-[11px] px-3.5 py-2 text-[15px] font-semibold transition-colors",
                  active
                    ? "bg-secondary text-secondary-foreground"
                    : "text-foreground hover:bg-accent",
                )}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
