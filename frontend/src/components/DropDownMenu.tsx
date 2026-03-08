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
  links: { path: string; label: string }[];
};

export function DropDownMenu({ label, links }: DropDownMenuProps) {
  return (
    <Menubar className="border-0 bg-transparent p-0 shadow-none">
      <MenubarMenu>
        <MenubarTrigger asChild>
          <Button variant="outline">{label}</Button>
        </MenubarTrigger>

        <MenubarContent>
          {links.map(({ path, label: itemLabel }) => (
            <MenubarItem key={path} asChild>
              <Link to={path}>{itemLabel}</Link>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}
