import { LayoutDashboardIcon, LogOutIcon } from "lucide-react";
import { Link } from "react-router";
import { Avatar, AvatarFallback } from "@/components/ui/avatar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { ADMIN_ACTIONS } from "@/lib/constants.ts";

export function AdminMenu() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated || !user) return null;

  function handleLogout() {
    logout();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Adminmeny"
        className="ml-auto shrink-0 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:ml-0"
      >
        <Avatar>
          <AvatarFallback className="bg-brand-soft text-[13px] font-bold text-brand-soft-foreground uppercase">
            {user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60">
        <div className="px-2 py-1.5">
          <p className="truncate text-sm font-bold">{user.username}</p>
          <p className="text-xs text-muted-foreground">Adminmodus</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <LayoutDashboardIcon />
              Adminpanel
            </Link>
          </DropdownMenuItem>
          {ADMIN_ACTIONS.map(({ label, icon: Icon, path }) => (
            <DropdownMenuItem key={path} asChild>
              <Link to={path}>
                <Icon />
                {label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem variant="destructive" onSelect={handleLogout}>
          <LogOutIcon />
          Logg ut
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
