import { createContext } from "react";

export type ApplicationContextType = {
  /** Public S3 bucket base URL, resolved at runtime from the backend config. */
  s3BaseUrl: string | undefined;
};

export const ApplicationContext = createContext<ApplicationContextType | null>(
  null,
);
