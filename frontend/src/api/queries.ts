import { kyClient } from "@/api/queryClient.ts";
import type {
  NewsFeedDTO,
  OrganizerDTO,
  RaceDTO,
  RaceRunnerDTO,
  RunnerDTO,
} from "../model/DTO.ts";

export const QUERIES = {
  race: {
    getAllRaces: {
      queryKey: ["race", "getAll"],
      queryFn: () => kyClient.get("/api/races").json<RaceDTO[]>(),
    },
    getRaceByUuid: (uuid: string) => ({
      queryKey: ["race", "getById", uuid],
      queryFn: () => kyClient.get(`/api/races/${uuid}`).json<RaceDTO>(),
    }),
    createRaces: (races: RaceDTO[]) => ({
      queryKey: ["race", "create"],
      queryFn: () =>
        kyClient
          .post("/api/races/createRaces", { json: races })
          .json<RaceDTO[]>(),
    }),
    updateRace: (uuid: string, race: RaceDTO) => ({
      queryKey: ["race", "update", uuid],
      queryFn: () =>
        kyClient.patch(`/api/races/${uuid}`, { json: race }).json<RaceDTO>(),
    }),
    deleteRace: (uuid: string) => ({
      queryKey: ["race", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/races/${uuid}`).json<void>(),
    }),
    getAllRunnersInRace: (uuid: string) => ({
      queryKey: ["race", uuid, "runnersInRace"],
      queryFn: () =>
        kyClient.get(`/api/races/${uuid}/runners`).json<RaceRunnerDTO[]>(),
    }),
  },
  organizer: {
    getAllOrganizers: {
      queryKey: ["organizer", "getAll"],
      queryFn: () => kyClient.get("/api/organizers").json<OrganizerDTO[]>(),
    },
    getOrganizerByUuid: (uuid: string) => ({
      queryKey: ["organizer", "getById", uuid],
      queryFn: () =>
        kyClient.get(`/api/organizers/${uuid}`).json<OrganizerDTO>(),
    }),
    createOrganizer: (organizer: OrganizerDTO) => ({
      queryKey: ["organizer", "create"],
      queryFn: () =>
        kyClient
          .post("/api/organizers/createOrganizer", { json: organizer })
          .json<OrganizerDTO>(),
    }),
    updateOrganizer: (uuid: string, organizer: OrganizerDTO) => ({
      queryKey: ["organizer", "update", uuid],
      queryFn: () =>
        kyClient
          .patch(`/api/organizers/${uuid}`, { json: organizer })
          .json<OrganizerDTO>(),
    }),
    deleteOrganizer: (uuid: string) => ({
      queryKey: ["organizer", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/organizers/${uuid}`).json<void>(),
    }),
  },
  runner: {
    getAllRunners: (name?: string) => ({
      queryKey: ["runner", "getAll", name],
      queryFn: () => {
        const searchParams = name ? { name } : undefined;
        return kyClient
          .get("/api/runners", { searchParams })
          .json<RunnerDTO[]>();
      },
    }),
    getRunnerByUuid: (uuid: string) => ({
      queryKey: ["runner", "getById", uuid],
      queryFn: () => kyClient.get(`/api/runners/${uuid}`).json<RunnerDTO>(),
    }),
    createRunners: (runners: RunnerDTO[]) => ({
      queryKey: ["runner", "create"],
      queryFn: () =>
        kyClient.post("/api/runners", { json: runners }).json<RunnerDTO[]>(),
    }),
    updateRunner: (uuid: string, runner: RunnerDTO) => ({
      queryKey: ["runner", "update", uuid],
      queryFn: () =>
        kyClient
          .patch(`/api/runners/${uuid}`, { json: runner })
          .json<RunnerDTO>(),
    }),
    deleteRunner: (uuid: string) => ({
      queryKey: ["runner", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/runners/${uuid}`).json<void>(),
    }),
    getAllRacesByRunner: (uuid: string) => ({
      queryKey: ["runner", uuid, "racesByRunner"],
      queryFn: () =>
        kyClient.get(`/api/runners/${uuid}/races`).json<RaceRunnerDTO[]>(),
    }),
  },
  newsfeed: {
    getAllNewsFeeds: {
      queryKey: ["newsfeed", "getAll"],
      queryFn: () => kyClient.get("/api/newsfeeds").json<NewsFeedDTO[]>(),
    },
    getNewsFeedByUuid: (uuid: string) => ({
      queryKey: ["newsfeed", "getById", uuid],
      queryFn: () => kyClient.get(`/api/newsfeeds/${uuid}`).json<NewsFeedDTO>(),
    }),
    createNewsFeed: (newsfeed: NewsFeedDTO) => ({
      queryKey: ["newsfeed", "create"],
      queryFn: () =>
        kyClient
          .post("/api/newsfeeds/createNewsfeed", { json: newsfeed })
          .json<NewsFeedDTO>(),
    }),
    updateNewsFeed: (uuid: string, newsfeed: NewsFeedDTO) => ({
      queryKey: ["newsfeed", "update", uuid],
      queryFn: () =>
        kyClient
          .patch(`/api/newsfeeds/${uuid}`, { json: newsfeed })
          .json<NewsFeedDTO>(),
    }),
    deleteNewsFeed: (uuid: string) => ({
      queryKey: ["newsfeed", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/newsfeeds/${uuid}`).json<void>(),
    }),
  },
} as const;
