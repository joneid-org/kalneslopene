import { kyClient } from "@/api/queryClient.ts";
import type { NewsFeedDTO, OrganizerDTO, RaceDTO } from "../model/DTO.ts";

export const QUERIES = {
  upComingRaces: {
    queryKey: ["upcomingRaces"],

    queryFn: async () => {
      const data = await kyClient
        .get("/api/races/upcomingRaces")
        .json<RaceDTO[]>();
      return data.map((race) => ({
        ...race,
        raceDate: new Date(race.raceDate),
      }));
    },
  },
  previousRaces: {
    queryKey: ["previousRaces"],
    queryFn: async () => {
      const data = await kyClient
        .get("/api/races/previousRaces")
        .json<RaceDTO[]>();
      return data.map((race) => ({
        ...race,
        raceDate: new Date(race.raceDate),
      }));
    },
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
