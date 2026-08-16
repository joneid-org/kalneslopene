import { createContext } from "react";

export type AuthUser = {
  username: string;
  roles: string[];
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  /** True until the initial session probe settles. Guard redirects on this. */
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
