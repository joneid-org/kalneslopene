import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "@/api/queryClient.ts";
import { Toaster } from "@/components/ui/sonner.tsx";
import { ApplicationProvider } from "@/context/ApplicationProvider.tsx";
import { AuthProvider } from "@/context/AuthProvider.tsx";
import { router } from "./routes";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ApplicationProvider>
          <RouterProvider router={router} />
          <Toaster />
        </ApplicationProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
