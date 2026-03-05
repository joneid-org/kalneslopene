import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar.tsx";

type DropDownMenuProps = {
  label: string;
};

export function DropDownMenu({ label }: DropDownMenuProps) {
  const omOss = [
    { path: "/SlikStartetDet", label: "Slik startet det" },
    { path: "/Løpsinformasjon", label: "Løpsinformasjon" },
    { path: "/Løypekart", label: "Løypekart" },
    { path: "/NavnIBlåløypa", label: "Navn i blåløypa" },
    { path: "/LøypaToForTo", label: "Løypa 200 for 200" },
    { path: "/Historie", label: "Historiske tilbakeblikk" },
    { path: "/Styret", label: "Styret" },
  ];

  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="outline">{label}</Button>
        </MenubarTrigger>

        <MenubarContent>
          {omOss.map(({ path, label: itemLabel }) => (
            <MenubarItem key={path} asChild>
              <Link to={path}>{itemLabel}</Link>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
