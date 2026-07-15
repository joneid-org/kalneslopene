import { createContext } from "react";

export type AuthUser = {
  username: string;
  roles: string[];
  credentials: string; // base64 encoded "username:password"
};

export type AuthContextType = {
  user: AuthUser | null;
  login: (username: string, password: string, roles: string[]) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);
