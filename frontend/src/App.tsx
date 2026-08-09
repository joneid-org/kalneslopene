import { ErrorBoundary } from "@sentry/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "@/api/queryClient.ts";
import { ErrorFallback } from "@/components/ErrorFallback.tsx";
import { Toaster } from "@/components/ui/sonner.tsx";
import { ApplicationProvider } from "@/context/ApplicationProvider.tsx";
import { AuthProvider } from "@/context/AuthProvider.tsx";
import { router } from "./routes";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApplicationProvider>
          <ErrorBoundary fallback={<ErrorFallback />}>
            <RouterProvider router={router} />
          </ErrorBoundary>
          <Toaster />
        </ApplicationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
