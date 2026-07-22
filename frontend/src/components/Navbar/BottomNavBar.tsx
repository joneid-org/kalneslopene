import { ChevronRight, History, Map as MapIcon } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import { Link, useLocation } from "react-router";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer.tsx";
import { cn } from "@/lib/utils.ts";
import { RacePickerDrawer } from "./RacePickerDrawer.tsx";

type IconProps = { className?: string };

const strokeProps: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

function HomeIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" {...strokeProps}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

function ResultsIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" {...strokeProps}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1" />
      <circle cx="4" cy="12" r="1" />
      <circle cx="4" cy="18" r="1" />
    </svg>
  );
}

function StatsIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" {...strokeProps}>
      <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-3" />
    </svg>
  );
}

function PicturesIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" {...strokeProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8.5" cy="9.5" r="1.5" />
      <path d="M4 16.5 9 11l4 4 3-3 4 4" />
    </svg>
  );
}

function MoreIcon({ className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" {...strokeProps}>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="12" cy="12" r="1.6" />
      <circle cx="19" cy="12" r="1.6" />
    </svg>
  );
}

type Tab = {
  path: string;
  label: string;
  Icon: ComponentType<IconProps>;
  isActive: (pathname: string) => boolean;
};

const tabs: Tab[] = [
  { path: "/", label: "Hjem", Icon: HomeIcon, isActive: (p) => p === "/" },
  {
    path: "/resultater",
    label: "Resultater",
    Icon: ResultsIcon,
    isActive: (p) => p.startsWith("/resultater"),
  },
  {
    path: "/bilder",
    label: "Bilder",
    Icon: PicturesIcon,
    isActive: (p) => p.startsWith("/bilder"),
  },
  {
    path: "/statistikk",
    label: "Statistikk",
    Icon: StatsIcon,
    isActive: (p) => p.startsWith("/statistikk"),
  },
];

const racePickerPaths = new Set(["/resultater", "/bilder"]);

const moreItems: {
  path: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}[] = [
  { path: "/løypekart", label: "Løypekart", Icon: MapIcon },
  { path: "/historie", label: "Historie", Icon: History },
];

const tabClasses = (active: boolean) =>
  cn(
    "flex flex-1 flex-col items-center gap-[3px] py-0.5",
    active ? "text-primary" : "text-muted-foreground",
  );

const labelClasses = (active: boolean) =>
  cn("text-[10px] leading-none", active ? "font-bold" : "font-semibold");

export function BottomNavBar() {
  const pathname = decodeURIComponent(useLocation().pathname);
  const moreActive = moreItems.some((item) => pathname.startsWith(item.path));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-border bg-card/90 px-2 pt-[9px] pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md md:hidden">
      {tabs.map(({ path, label, Icon, isActive }) => {
        const active = isActive(pathname);
        const content = (
          <>
            <Icon className="size-[23px]" />
            <span className={labelClasses(active)}>{label}</span>
          </>
        );
        if (racePickerPaths.has(path)) {
          return (
            <RacePickerDrawer key={path} basePath={path}>
              <button type="button" className={tabClasses(active)}>
                {content}
              </button>
            </RacePickerDrawer>
          );
        }
        return (
          <Link key={path} to={path} className={tabClasses(active)}>
            {content}
          </Link>
        );
      })}

      <Drawer>
        <DrawerTrigger className={tabClasses(moreActive)}>
          <MoreIcon className="size-[23px]" />
          <span className={labelClasses(moreActive)}>Mer</span>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="pb-2">
            <DrawerTitle className="font-display text-lg font-extrabold tracking-tight">
              Mer
            </DrawerTitle>
          </DrawerHeader>
          <div className="flex flex-col px-3 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            {moreItems.map(({ path, label, Icon }) => (
              <DrawerClose key={path} asChild>
                <Link
                  to={path}
                  className="flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-accent"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                    <Icon className="size-5" />
                  </span>
                  <span className="flex-1 text-base font-semibold">
                    {label}
                  </span>
                  <ChevronRight className="size-5 text-muted-foreground" />
                </Link>
              </DrawerClose>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </nav>
  );
}
