import {forwardRef} from "react";
import {HomeIcon} from "lucide-react";
import {Link} from "react-router";
import {OmOssDropDownMenu} from "@/components/OmOssDropDownMenu.tsx";
import {DynamicDropDownMenu} from "@/components/DynamicDropDownMenu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {getAvailableYears} from "@/data/mockdata.ts";
import MobileNavBarMenu from "@/components/MobileNavBarMenu.tsx";


const headerBarDynamic = [
    {path: "/Resultater", label: "Resultater"},
    {path: "/Bilder", label: "Bilder"},
];
const headerBarStatic = [
    {path: "/Statistikk", label: "Statistikk"},
    {path: "/Lopskalender", label: "Løpskalender"},
];
const OM_OSS = [
    {path: "/SlikStartetDet", label: "Slik startet det"},
    {path: "/Løpsinformasjon", label: "Løpsinformasjon"},
    {path: "/Løypekart", label: "Løypekart"},
    {path: "/NavnIBlåløypa", label: "Navn i blåløypa"},
    {path: "/LøypaToForTo", label: "Løypa 200 for 200"},
    {path: "/Historie", label: "Historiske tilbakeblikk"},
    {path: "/Styret", label: "Styret"},
];

const years = getAvailableYears();
export const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
    return (
        <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between container mx-auto px-4 py-4">
                <div className="min-w-0">
                    <Link to="/" className="flex items-center gap-2">
                        <HomeIcon/>
                        <div className="min-w-0">
                            <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
                        </div>
                    </Link>
                </div>

                <div className="md:hidden">
                    <MobileNavBarMenu
                        headerBarDynamic={headerBarDynamic}
                        headerBarStatic={headerBarStatic}
                        omOss={OM_OSS}
                        years={years}
                    />
                </div>

                <nav className="hidden md:flex gap-1 items-center">
                    {headerBarDynamic.map(({path, label}) => (
                        <DynamicDropDownMenu
                            key={label}
                            label={label}
                            basePath={path}
                            years={years}
                        />
                    ))}
                    {headerBarStatic.map(({path, label}) => (
                        <Link key={label} to={path}>
                            <Button variant={"outline"}>{label}</Button>
                        </Link>
                    ))}
                    <OmOssDropDownMenu label={"Om oss"} omOss={OM_OSS}/>
                </nav>
            </div>
        </header>
    );
});
