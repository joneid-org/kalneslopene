import {HomeIcon} from "lucide-react";
import {Link} from "react-router";
import {OmOssDropDownMenu} from "@/components/OmOssDropDownMenu.tsx";
import {DynamicDropDownMenu} from "@/components/DynamicDropDownMenu.tsx";
import {Button} from "@/components/ui/button.tsx";

export interface NavBarMenuProps {
    headerBarDynamic: { path: string; label: string }[];
    headerBarStatic: { path: string; label: string }[];
    years: number[];
}

export default function FullNavBarMenu({
                                           headerBarDynamic,
                                           headerBarStatic,
                                           years,
                                       }: NavBarMenuProps) {
    return (
        <div className="flex items-center justify-between container mx-auto px-4 py-4">

            <div className="min-w-0">
                <Link to="/" className="flex items-center gap-2">
                    <HomeIcon />
                    <div className="min-w-0">
                        <h1 className="font-bold text-xl truncate">Torsdagsløpet</h1>
                    </div>
                </Link>
            </div>

            <nav className="hidden md:flex gap-1 items-center">
                {headerBarDynamic.map(({ path, label }) => (
                    <DynamicDropDownMenu key={label} label={label} basePath={path} years={years}/>
                ))}

                {headerBarStatic.map(({ path, label }) => (
                    <Link key={label} to={path}>
                        <Button variant={"outline"}>{label}</Button>
                    </Link>
                ))}
                <OmOssDropDownMenu label={"Om oss"} />
            </nav>
        </div>
    );
}