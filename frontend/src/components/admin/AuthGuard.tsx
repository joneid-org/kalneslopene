import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/useAuth.ts";

export function AuthGuard() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirecting before the session probe settles would bounce every refresh on an admin page.
  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <p className="text-sm text-muted-foreground">Laster...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/logg-inn" replace />;
  }

  return <Outlet />;
}
