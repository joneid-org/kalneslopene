import {useBoolean} from "@reactuses/core";
import {ChevronDownIcon, HomeIcon, MenuIcon, XIcon} from "lucide-react";
import {forwardRef} from "react";
import {Link} from "react-router";
import {OmOssDropDownMenu} from "@/components/OmOssDropDownMenu.tsx";
import {DynamicDropDownMenu} from "@/components/DynamicDropDownMenu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {getAvailableYears, getRacesByYear} from "@/data/mockdata.ts";


const headerBarDynamic = [
    {path: "/Resultater", label: "Resultater"},
    {path: "/Bilder", label: "Bilder"},
];
const headerBarStatic = [
    {path: "/Statistikk", label: "Statistikk"},
    {path: "/Lopskalender", label: "Løpskalender"},
];

const omOssItems = [
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
    const {
        value: mobileOpen,
        setFalse: closeMobile,
        toggle: toggleMobile,
    } = useBoolean(false);

    return (
        <header ref={ref} className="border-b bg-white sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between container mx-auto px-4 py-4">
                <div className="min-w-0">
                    <Link
                        to="/"
                        className="flex items-center gap-2"
                    >
                        <HomeIcon/>
                        <div className="min-w-0">
                            <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
                        </div>
                    </Link>
                </div>

                <div className="md:hidden">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleMobile}
                        aria-label={mobileOpen ? "Lukk meny" : "Åpne meny"}
                        aria-expanded={mobileOpen}
                        aria-controls="mobile-nav"
                    >
                        {mobileOpen ? <XIcon/> : <MenuIcon/>}
                    </Button>
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
                    <OmOssDropDownMenu label={"Om oss"}/>
                </nav>
            </div>

            {mobileOpen && (
                <div className="md:hidden" id="mobile-nav">
                    <button
                        type="button"
                        className="fixed inset-0 z-40 bg-black/30"
                        aria-label="Lukk meny"
                        onClick={closeMobile}
                    />
                    <div
                        className="fixed left-0 right-0 top-[73px] z-50 border-b overflow-y-auto max-h-[calc(100vh-73px)] bg-white shadow-md">
                        <nav className="container mx-auto px-4 py-4">
                            <div className="flex flex-col gap-2">
                                {headerBarDynamic.map(({path: basePath, label}) => (
                                    <details key={label} className="rounded-md border">
                                        <summary className="list-none cursor-pointer">
                                            <div className="flex items-center justify-between px-3 py-2">
                                                <span className="font-medium">{label}</span>
                                                <ChevronDownIcon className="size-4 opacity-70"/>
                                            </div>
                                        </summary>

                                        <div className="px-3 pb-3">
                                            <div className="flex flex-col gap-2">
                                                {years.map((year) => (
                                                    <details key={year} className="rounded-md border">
                                                        <summary className="list-none cursor-pointer">
                                                            <div
                                                                className="flex items-center justify-between px-3 py-2">
                                                                <span>{year}</span>
                                                                <ChevronDownIcon className="size-4 opacity-70"/>
                                                            </div>
                                                        </summary>

                                                        <div className="px-3 pb-3">
                                                            <div className="flex flex-col gap-2">
                                                                {getRacesByYear(year).map((race) => (
                                                                    <Link
                                                                        key={race.id}
                                                                        to={`${basePath}/${year}/${race.week}`}
                                                                        onClick={closeMobile}
                                                                        className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                                                    >
                                                                        {race.date}
                                                                    </Link>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </details>
                                                ))}
                                            </div>
                                        </div>
                                    </details>
                                ))}

                                {headerBarStatic.map(({path, label}) => (
                                    <Link key={label} to={path} onClick={closeMobile}>
                                        <Button className="w-full justify-start" variant="outline">
                                            {label}
                                        </Button>
                                    </Link>
                                ))}

                                <details className="rounded-md border">
                                    <summary className="list-none cursor-pointer">
                                        <div className="flex items-center justify-between px-3 py-2">
                                            <span className="font-medium">Om oss</span>
                                            <ChevronDownIcon className="size-4 opacity-70"/>
                                        </div>
                                    </summary>

                                    <div className="px-3 pb-3">
                                        <div className="flex flex-col gap-2">
                                            {omOssItems.map(({path, label}) => (
                                                <Link
                                                    key={path}
                                                    to={path}
                                                    onClick={closeMobile}
                                                    className="rounded-md border px-3 py-2 text-sm hover:bg-muted"
                                                >
                                                    {label}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </details>
                            </div>
                        </nav>
                    </div>
                </div>
            )}
        </header>
    );
});
