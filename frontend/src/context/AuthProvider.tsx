import {
  hashKey,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo } from "react";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { setUnauthorizedHandler } from "@/api/queryClient.ts";
import { AuthContext, type AuthUser } from "@/context/AuthContext.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  // The session cookie is httpOnly, so the only way to know whether we are logged in is to ask.
  const { data: me, isPending } = useQuery(QUERIES.auth.me);
  const user = me ?? null;

  const setUser = useCallback(
    (authUser: AuthUser | null) =>
      qc.setQueryData(QUERIES.auth.me.queryKey, authUser),
    [qc],
  );

  const clearSession = useCallback(() => {
    qc.removeQueries({
      predicate: (query) =>
        query.queryHash !== hashKey(QUERIES.auth.me.queryKey),
    });
    setUser(null);
  }, [qc, setUser]);

  // A 401 anywhere means the session died server-side. Dropping the user makes AuthGuard
  // redirect on its own, which keeps the navigation inside the router.
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const { mutate: logout } = useMutation({
    mutationFn: MUTATIONS.auth.logout,
    onSettled: clearSession,
  });

  const value = useMemo(
    () => ({
      user,
      login: setUser,
      logout: () => logout(),
      isAuthenticated: user !== null,
      isLoading: isPending,
    }),
    [user, setUser, logout, isPending],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
