import { use } from "react";
import { ApplicationContext } from "@/context/ApplicationContext.ts";

export function useApplicationContext() {
  const ctx = use(ApplicationContext);
  if (!ctx)
    throw new Error(
      "useApplicationContext must be used within ApplicationProvider",
    );
  return ctx;
}
