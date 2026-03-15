import { kyClient } from "@/api/queryClient.ts";
import type { RaceDTO } from "../model/DTO.ts";

export const QUERIES = {
  upComingRaces: {
    queryKey: ["upcomingRaces"],
    queryFn: () => kyClient.get("/api/races/upcomingRaces").json<RaceDTO[]>(),
  },
} as const;
