import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/context/AuthContext.tsx";

export function AuthGuard() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/logg-inn" replace />;
  }

  return <Outlet />;
}
