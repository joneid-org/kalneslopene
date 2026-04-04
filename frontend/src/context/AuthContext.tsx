import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";

export type AuthUser = {
  username: string;
  roles: string[];
  credentials: string; // base64 encoded "username:password"
};

type AuthContextType = {
  user: AuthUser | null;
  login: (username: string, password: string, roles: string[]) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "auth_credentials";

function loadFromStorage(): AuthUser | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadFromStorage);

  const login = useCallback(
    (username: string, password: string, roles: string[]) => {
      const credentials = btoa(`${username}:${password}`);
      const authUser: AuthUser = { username, roles, credentials };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
      setUser(authUser);
    },
    [],
  );

  const logout = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: user !== null }),
    [user, login, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
