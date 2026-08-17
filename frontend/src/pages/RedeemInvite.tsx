import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useMutation } from "@tanstack/react-query";
import { UserPlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { z } from "zod";
import { MUTATIONS } from "@/api/mutations.ts";
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

const redeemInviteSchema = z
  .object({
    username: z.string().trim().min(1, "Brukernavn er påkrevd"),
    password: z.string().min(8, "Passordet må være minst 8 tegn"),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passordene er ikke like",
    path: ["confirmPassword"],
  });

type RedeemInviteValues = z.infer<typeof redeemInviteSchema>;

export function RedeemInvite() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, setError, formState } =
    useForm<RedeemInviteValues>({
      defaultValues: { username: "", password: "", confirmPassword: "" },
      resolver: standardSchemaResolver(redeemInviteSchema),
    });
  const { errors } = formState;

  const registerMutation = useMutation({
    mutationFn: ({
      username,
      password,
    }: Pick<RedeemInviteValues, "username" | "password">) =>
      MUTATIONS.auth.registerWithInvite(token ?? "", { username, password }),
    onSuccess: (result, { username, password }) => {
      login(username, password, result.roles);
      navigate("/admin");
    },
    onError: () =>
      setError("root", {
        message:
          "Kunne ikke opprette bruker. Invitasjonen kan være utløpt eller allerede brukt, eller brukernavnet kan være opptatt.",
      }),
    meta: { showsOwnError: true },
  });

  const onSubmit = handleSubmit(({ username, password }) =>
    registerMutation.mutate({ username, password }),
  );
  const isSubmitting = registerMutation.isPending;

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="size-5 text-primary" />
              <CardTitle className="text-xl">Opprett bruker</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Du er invitert til Torsdagsløpet. Velg brukernavn og passord.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Brukernavn</Label>
                <Input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="Skriv inn brukernavn"
                  aria-invalid={!!errors.username}
                  aria-describedby={errors.username && "username-error"}
                  {...register("username")}
                />
                {errors.username && (
                  <p id="username-error" className="text-xs text-destructive">
                    {errors.username.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Passord</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Skriv inn passord"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password && "password-error"}
                  {...register("password")}
                />
                {errors.password && (
                  <p id="password-error" className="text-xs text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword">Bekreft passord</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Skriv inn passordet på nytt"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword && "confirmPassword-error"
                  }
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-xs text-destructive"
                  >
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
              {errors.root && (
                <p className="text-sm text-destructive">
                  {errors.root.message}
                </p>
              )}
              <Button
                type="submit"
                className="w-full mt-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Oppretter..." : "Opprett bruker"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
