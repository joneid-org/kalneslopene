import { HomeIcon } from "lucide-react";
import { forwardRef } from "react";
import { Link } from "react-router";
import { DropDownMenu } from "@/components/DropDownMenu.tsx";
import { DynamicDropDownMenu } from "@/components/DynamicDropDownMenu.tsx";
import MobileNavBarMenu from "@/components/MobileNavBarMenu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { getAvailableYears } from "@/data/mockdata.ts";

const headerBarDynamic = [
  { path: "/Resultater", label: "Resultater" },
  { path: "/Bilder", label: "Bilder" },
];
const headerBarStatic = [
  { path: "/Statistikk", label: "Statistikk" },
  { path: "/Lopskalender", label: "Løpskalender" },
];
const OM_OSS = [
  { path: "/SlikStartetDet", label: "Slik startet det" },
  { path: "/Løpsinformasjon", label: "Løpsinformasjon" },
  { path: "/Løypekart", label: "Løypekart" },
  { path: "/NavnIBlåløypa", label: "Navn i blåløypa" },
  { path: "/LøypaToForTo", label: "Løypa 200 for 200" },
  { path: "/Historie", label: "Historiske tilbakeblikk" },
  { path: "/Styret", label: "Styret" },
];

const years = getAvailableYears();
export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
  return (
    <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="flex items-center container mx-auto px-4 py-4">
        <div className="md:hidden pr-2">
          <MobileNavBarMenu
            headerBarDynamic={headerBarDynamic}
            headerBarStatic={headerBarStatic}
            omOss={OM_OSS}
            years={years}
          />
        </div>

        <div className={"flex container justify-between"}>
          <div className="min-w-0">
            <Link to="/" className="flex items-center gap-2">
              <Button variant={"outline"} size={"icon"}>
                <HomeIcon />
              </Button>
              <div className="min-w-0">
                <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex gap-1 items-center">
            {headerBarDynamic.map(({ path, label }) => (
              <DynamicDropDownMenu
                key={label}
                label={label}
                basePath={path}
                years={years}
              />
            ))}
            {headerBarStatic.map(({ path, label }) => (
              <Link key={label} to={path}>
                <Button variant={"outline"}>{label}</Button>
              </Link>
            ))}
            <DropDownMenu label={"Om oss"} links={OM_OSS} />
          </nav>
        </div>
      </div>
    </header>
  );
});
