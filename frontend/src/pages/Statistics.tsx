import { ChartColumn, type LucideIcon, UserRound } from "lucide-react";
import { NavLink, Outlet } from "react-router";
import { RUNNER_STATISTICS_PATH } from "@/lib/constants.ts";
import { cn } from "@/lib/utils.ts";

const TABS: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: "/statistikk", label: "Løp", icon: ChartColumn, end: true },
  { to: RUNNER_STATISTICS_PATH, label: "Løpere", icon: UserRound },
];

export function Statistics() {
  return (
    <div className="page-content flex flex-col gap-4 md:gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="page-title">Statistikk</h1>
          <p className="page-subtitle mt-1">
            Tall og rekorder fra Torsdagsløpet
          </p>
        </div>
        <nav className="flex rounded-full bg-muted p-1 sm:w-72">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold transition-colors",
                  isActive
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )
              }
            >
              <Icon className="size-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
