import { useQuery } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useMemo } from "react";
import { QUERIES } from "@/api/queries.ts";
import { ApplicationContext } from "@/context/ApplicationContext.ts";

export function ApplicationProvider({ children }: { children: ReactNode }) {
  const { data: config } = useQuery(QUERIES.config.get);

  const value = useMemo(
    () => ({ s3BaseUrl: config?.s3BaseUrl }),
    [config?.s3BaseUrl],
  );

  return <ApplicationContext value={value}>{children}</ApplicationContext>;
}
