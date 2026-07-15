import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth.ts";

export function AuthGuard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/logg-inn" replace />;
  }

  return <Outlet />;
}
