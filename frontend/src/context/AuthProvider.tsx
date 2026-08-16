import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { queryClient, setUnauthorizedHandler } from "@/api/queryClient.ts";
import { AuthContext, type AuthUser } from "@/context/AuthContext.ts";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // The session cookie is httpOnly, so the only way to know whether we are logged in is to ask.
  useEffect(() => {
    let cancelled = false;
    QUERIES.auth.me
      .queryFn()
      .then((me) => {
        if (!cancelled) setUser({ username: me.username, roles: me.roles });
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearSession = useCallback(() => {
    setUser(null);
    queryClient.clear();
  }, []);

  // A 401 anywhere means the session died server-side. Dropping the user makes AuthGuard
  // redirect on its own, which keeps the navigation inside the router.
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const login = useCallback((authUser: AuthUser) => {
    setUser(authUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await MUTATIONS.auth.logout();
    } finally {
      clearSession();
    }
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: user !== null, isLoading }),
    [user, login, logout, isLoading],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}
