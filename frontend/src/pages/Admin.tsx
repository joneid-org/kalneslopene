import {
  CalendarIcon,
  ClipboardListIcon,
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

const actions = [
  { label: "Administrer løp", icon: CalendarIcon, path: "/admin/races" },
  {
    label: "Registrer resultater",
    icon: ClipboardListIcon,
    path: "/admin/results",
  },
  { label: "Legg til løper", icon: UserPlusIcon, path: "/admin/runners" },
  { label: "Legg til organisator", icon: UsersIcon, path: "/admin/organizers" },
  { label: "Legg til nyhet", icon: NewspaperIcon, path: "/admin/newsfeeds" },
] as const;

export function Admin() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Administrer innhold på siden.
          </p>
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
    </div>
  );
}
