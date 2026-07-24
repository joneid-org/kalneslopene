import {
  CalendarIcon,
  ClipboardListIcon,
  FileUpIcon,
  ImageIcon,
  LogOutIcon,
  NewspaperIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { useAuth } from "@/hooks/useAuth.ts";

const actions = [
  { label: "Administrer løp", icon: CalendarIcon, path: "/admin/løp" },
  {
    label: "Registrer resultater",
    icon: ClipboardListIcon,
    path: "/admin/resultater",
  },
  {
    label: "Registrer resultat fra fil",
    icon: FileUpIcon,
    path: "/admin/resultater/import",
  },
  { label: "Legg til bilder", icon: ImageIcon, path: "/admin/bilder" },
  { label: "Legg til løper", icon: UserPlusIcon, path: "/admin/løpere" },
  {
    label: "Legg til arrangør",
    icon: UsersIcon,
    path: "/admin/arrangører",
  },
  { label: "Legg til nyhet", icon: NewspaperIcon, path: "/admin/nyheter" },
  { label: "Administrer tagger", icon: NewspaperIcon, path: "/admin/tagger" },
] as const;

export function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/logg-inn");
  }

  return (
    <div className="page-content max-w-md mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Innlogget som <span className="font-medium">{user?.username}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOutIcon className="size-4" />
          Logg ut
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Handlinger</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {actions.map(({ label, icon: Icon, path }) => (
            <Button
              key={label}
              variant="outline"
              className="justify-start gap-3 h-11"
              onClick={() => navigate(path)}
            >
              <Icon className="size-4 text-primary" />
              {label}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
