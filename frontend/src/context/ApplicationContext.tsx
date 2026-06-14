import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { createContext, use, useMemo } from "react";
import { QUERIES } from "@/api/queries.ts";

type ApplicationContextType = {
  /** Public S3 bucket base URL, resolved at runtime from the backend config. */
  s3BaseUrl: string | undefined;
};

const ApplicationContext = createContext<ApplicationContextType | null>(null);

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { data: config } = useQuery(QUERIES.config.get);

  const value = useMemo(
    () => ({ s3BaseUrl: config?.s3BaseUrl }),
    [config?.s3BaseUrl],
  );

  return <ApplicationContext value={value}>{children}</ApplicationContext>;
}

export function useApplicationContext() {
  const ctx = use(ApplicationContext);
  if (!ctx)
    throw new Error(
      "useApplicationContext must be used within ApplicationProvider",
    );
  return ctx;
}
