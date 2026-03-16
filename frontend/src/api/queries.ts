import { kyClient } from "@/api/queryClient.ts";
import type { NewsFeedDTO, OrganizerDTO, RaceDTO } from "../model/DTO.ts";

export const QUERIES = {
  upComingRaces: {
    queryKey: ["upcomingRaces"],
    queryFn: () => kyClient.get("/api/races/upcomingRaces").json<RaceDTO[]>(),
  },

  allNews: {
    queryKey: ["latestNews"],
    queryFn: () =>
      kyClient.get("/api/newsFeed/latest?amount=3").json<NewsFeedDTO[]>(),
  },
  organizers: {
    queryKey: ["organizers"],
    queryFn: () => kyClient.get("/api/organizer").json<OrganizerDTO[]>(),
  },
} as const;
