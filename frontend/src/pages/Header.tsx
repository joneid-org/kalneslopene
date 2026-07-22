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
      <div className="mx-auto flex h-14 w-full max-w-(--page-max-width) items-center gap-3 px-4 md:h-17.5">
        <Link to="/" className="group flex min-w-0 items-center gap-2.5">
          <svg
            viewBox="0 0 100 100"
            className="size-8 shrink-0 transition-transform group-hover:scale-105"
            aria-hidden="true"
          >
            <rect x="4" y="4" width="92" height="92" rx="26" fill="#1f7a4d" />
            <path
              fillRule="evenodd"
              fill="#fff"
              d="M17.9 17.3L17.0 22.6L17.0 46.9L12.6 51.8L11.7 54.2L11.7 59.7L10.9 61.3L11.1 64.2L13.3 68.6L17.5 71.5L21.5 72.8L23.9 72.8L34.5 59.3L36.3 59.1L38.3 60.6L38.9 69.2L35.4 73.7L34.5 80.5L35.8 83.4L37.6 84.5L46.7 86.9L51.8 87.6L57.1 90.2L62.2 90.7L67.5 87.8L79.9 83.4L78.1 79.6L74.8 81.0L72.8 80.7L71.7 79.4L71.7 77.6L77.6 69.0L80.7 66.6L82.1 64.4L82.7 59.7L81.2 53.1L79.9 50.4L72.1 46.5L70.3 44.7L68.4 38.9L63.9 32.5L63.0 27.0L60.6 23.2L55.5 20.6L52.9 17.9L48.2 10.6L46.9 9.5L43.1 10.0L38.3 13.3L35.2 16.4L32.8 17.5L30.8 17.7L28.1 16.8L18.8 16.8ZM22.4 21.2L27.0 20.8L31.6 22.1L37.6 19.7L42.7 15.1L45.4 15.1L48.2 17.9L51.3 22.4L54.4 24.8L56.9 25.7L58.4 27.2L59.7 29.7L60.2 35.0L64.6 40.5L67.0 47.1L68.4 48.9L75.9 52.9L77.2 54.2L78.5 59.1L78.5 62.2L74.5 66.4L65.3 79.4L64.4 81.8L64.4 84.3L63.0 85.8L58.8 86.5L53.1 83.6L40.9 81.4L39.2 80.1L39.4 75.0L42.9 71.5L43.6 67.7L42.3 64.8L42.5 56.6L41.8 54.2L38.7 51.8L35.6 51.8L33.0 52.9L30.5 57.7L22.6 67.5L18.6 67.5L15.7 64.8L15.3 63.9L15.3 61.7L15.9 60.6L15.7 54.6L20.8 48.9L21.2 22.6Z"
            />
            <circle cx="85.5" cy="78.4" r="5.5" fill="#f2a33c" />
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
          <DynamicDropDownMenu
            label="Bilder"
            basePath="/Bilder"
            races={races ?? []}
            active={pathname.startsWith("/Bilder")}
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
