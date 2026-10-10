import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { useAuth } from "@/hooks/useAuth.ts";

export function Login() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { data: setupStatus, isPending } = useQuery(QUERIES.auth.isSetupNeeded);

  const loginMutation = useMutation({
    mutationFn: () => MUTATIONS.auth.login({ username, password }),
    onSuccess: (result) => {
      login(username, password, result.roles);
      navigate("/admin");
    },
    meta: { showsOwnError: true },
  });

  const setupMutation = useMutation({
    mutationFn: () => MUTATIONS.auth.setup({ username, password }),
    onSuccess: (result) => {
      qc.setQueryData(QUERIES.auth.isSetupNeeded.queryKey, { needed: false });
      login(username, password, result.roles);
      navigate("/admin");
    },
    meta: { showsOwnError: true },
  });

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Laster...</p>
      </div>
    );
  }

  const isSetup = setupStatus?.needed ?? false;
  const activeMutation = isSetup ? setupMutation : loginMutation;
  const loading = activeMutation.isPending;
  const error = activeMutation.isError
    ? isSetup
      ? "Kunne ikke opprette bruker. Prøv igjen."
      : "Ugyldig brukernavn eller passord."
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    activeMutation.mutate();
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              {isSetup ? (
                <UserPlusIcon className="size-5 text-primary" />
              ) : (
                <LogInIcon className="size-5 text-primary" />
              )}
              <CardTitle className="text-xl">
                {isSetup ? "Opprett administrator" : "Logg inn"}
              </CardTitle>
            </div>
            {isSetup && (
              <p className="text-sm text-muted-foreground mt-1">
                Ingen brukere er registrert. Opprett den første administratoren.
              </p>
            )}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Brukernavn</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Skriv inn brukernavn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Passord</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={isSetup ? "new-password" : "current-password"}
                  placeholder="Skriv inn passord"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading
                  ? isSetup
                    ? "Oppretter..."
                    : "Logger inn..."
                  : isSetup
                    ? "Opprett administrator"
                    : "Logg inn"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
