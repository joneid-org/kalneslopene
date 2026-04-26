import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { LogInIcon, UserPlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { QUERIES } from "@/api/queries.ts";
import { useAuth } from "@/context/AuthContext.tsx";

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [setupNeeded, setSetupNeeded] = useState<boolean | null>(null);

  useEffect(() => {
    QUERIES.auth.isSetupNeeded
      .queryFn()
      .then((res) => setSetupNeeded(res.needed))
      .catch(() => setSetupNeeded(false));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await QUERIES.auth.login({ username, password }).queryFn();
      login(username, password, result.roles);
      navigate("/admin");
    } catch {
      setError("Ugyldig brukernavn eller passord.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await QUERIES.auth.setup({ username, password }).queryFn();
      login(username, password, result.roles);
      navigate("/admin");
    } catch {
      setError("Kunne ikke opprette bruker. Prøv igjen.");
    } finally {
      setLoading(false);
    }
  }

  if (setupNeeded === null) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Laster...</p>
      </div>
    );
  }

  const isSetup = setupNeeded;

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
            <form
              onSubmit={isSetup ? handleSetup : handleLogin}
              className="flex flex-col gap-4"
            >
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
