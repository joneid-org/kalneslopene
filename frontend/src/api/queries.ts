import { kyClient } from "@/api/queryClient.ts";
import type {
  LoginRequest,
  LoginResponse,
  MilestoneDTO,
  NewsFeedDTO,
  NewsfeedSettingsDTO,
  NewsfeedTagDTO,
  OrganizerDTO,
  RaceDTO,
  RaceRunnerDTO,
  RunnerDTO,
  YrForecast,
} from "../model/DTO.ts";

export const QUERIES = {
  yr: {
    getForecast: {
      queryKey: ["yr", "forecast"],
      queryFn: async () => {
        const res = await fetch(
          "https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=59.30602&lon=11.0429",
          { headers: { Accept: "application/json" } },
        );
        if (!res.ok) throw new Error("Yr fetch failed");
        return res.json() as Promise<YrForecast>;
      },
    },
  },
  race: {
    getAllRaces: {
      queryKey: ["race", "getAll"],
      queryFn: async () => {
        return await kyClient.get("/api/races").json<RaceDTO[]>();
      },
    },
    getRaceByUuid: (uuid: string) => ({
      queryKey: ["race", "getById", uuid],
      queryFn: async () => {
        return await kyClient.get(`/api/races/${uuid}`).json<RaceDTO>();
      },
    }),
    createRaces: (races: RaceDTO[]) => ({
      queryKey: ["race", "create"],
      queryFn: async () => {
        return await kyClient
          .post("/api/races/createRaces", { json: races })
          .json<RaceDTO[]>();
      },
    }),
    updateRace: (uuid: string, race: RaceDTO) => ({
      queryKey: ["race", "update", uuid],
      queryFn: async () => {
        return await kyClient
          .patch(`/api/races/${uuid}`, { json: race })
          .json<RaceDTO>();
      },
    }),
    deleteRace: (uuid: string) => ({
      queryKey: ["race", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/races/${uuid}`).json<void>(),
    }),
    getAllRunnersInRace: (uuid: string) => ({
      queryKey: ["race", uuid, "runnersInRace"],
      queryFn: async () => {
        return await kyClient
          .get(`/api/races/${uuid}/runners`)
          .json<RaceRunnerDTO[]>();
      },
    }),
    addRunnersToRace: (raceUuid: string, runners: RaceRunnerDTO[]) => ({
      queryKey: ["race", raceUuid, "runnersInRace", "add"],
      queryFn: () =>
        kyClient
          .post(`/api/races/${raceUuid}/runners`, { json: runners })
          .json<RaceRunnerDTO[]>(),
    }),
    updateRunnerInRace: (
      raceUuid: string,
      runnerUuid: string,
      runner: RaceRunnerDTO,
    ) => ({
      queryKey: ["race", raceUuid, "runnersInRace", "update", runnerUuid],
      queryFn: () =>
        kyClient
          .patch(`/api/races/${raceUuid}/runners/${runnerUuid}`, {
            json: runner,
          })
          .json<RaceRunnerDTO>(),
    }),
    removeRunnersFromRace: (raceUuid: string, runners: RaceRunnerDTO[]) => ({
      queryKey: ["race", raceUuid, "runnersInRace", "remove"],
      queryFn: () =>
        kyClient
          .delete(`/api/races/${raceUuid}/runners`, { json: runners })
          .json<void>(),
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
      queryFn: async () => {
        return await kyClient
          .get(`/api/runners/${uuid}/races`)
          .json<RaceRunnerDTO[]>();
      },
    }),
  },
  newsfeed: {
    getAllNewsFeeds: {
      queryKey: ["newsfeed", "getAll"],
      queryFn: async () => {
        const data = await kyClient.get("/api/newsfeeds").json<NewsFeedDTO[]>();
        return data.map((feed) => ({ ...feed, date: new Date(feed.date) }));
      },
    },
    getNewsFeedByUuid: (uuid: string) => ({
      queryKey: ["newsfeed", "getById", uuid],
      queryFn: async () => {
        const data = await kyClient
          .get(`/api/newsfeeds/${uuid}`)
          .json<NewsFeedDTO>();
        return { ...data, date: new Date(data.date) };
      },
    }),
    createNewsFeed: (newsfeed: NewsFeedDTO) => ({
      queryKey: ["newsfeed", "create"],
      queryFn: async () => {
        const data = await kyClient
          .post("/api/newsfeeds/createNewsfeed", { json: newsfeed })
          .json<NewsFeedDTO>();
        return { ...data, date: new Date(data.date) };
      },
    }),
    updateNewsFeed: (uuid: string, newsfeed: NewsFeedDTO) => ({
      queryKey: ["newsfeed", "update", uuid],
      queryFn: async () => {
        const data = await kyClient
          .patch(`/api/newsfeeds/${uuid}`, { json: newsfeed })
          .json<NewsFeedDTO>();
        return { ...data, date: new Date(data.date) };
      },
    }),
    deleteNewsFeed: (uuid: string) => ({
      queryKey: ["newsfeed", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/newsfeeds/${uuid}`).json<void>(),
    }),
    getSettings: {
      queryKey: ["newsfeed", "settings"],
      queryFn: () =>
        kyClient.get("/api/newsfeeds/settings").json<NewsfeedSettingsDTO>(),
    },
    updateSettings: (dto: NewsfeedSettingsDTO) => ({
      queryKey: ["newsfeed", "settings", "update"],
      queryFn: () =>
        kyClient
          .patch("/api/newsfeeds/settings", { json: dto })
          .json<NewsfeedSettingsDTO>(),
    }),
    getAllTags: {
      queryKey: ["newsfeed", "tags"],
      queryFn: () =>
        kyClient.get("/api/newsfeeds/tags").json<NewsfeedTagDTO[]>(),
    },
    createTag: (dto: NewsfeedTagDTO) => ({
      queryKey: ["newsfeed", "tags", "create"],
      queryFn: () =>
        kyClient
          .post("/api/newsfeeds/tags", { json: dto })
          .json<NewsfeedTagDTO>(),
    }),
    updateTag: (uuid: string, dto: NewsfeedTagDTO) => ({
      queryKey: ["newsfeed", "tags", "update", uuid],
      queryFn: () =>
        kyClient
          .patch(`/api/newsfeeds/tags/${uuid}`, { json: dto })
          .json<NewsfeedTagDTO>(),
    }),
    deleteTag: (uuid: string) => ({
      queryKey: ["newsfeed", "tags", "delete", uuid],
      queryFn: () =>
        kyClient.delete(`/api/newsfeeds/tags/${uuid}`).json<void>(),
    }),
  },
  auth: {
    login: (request: LoginRequest) => ({
      queryKey: ["auth", "login"],
      queryFn: () =>
        kyClient
          .post("/api/auth/login", { json: request })
          .json<LoginResponse>(),
    }),
  },
  milestone: {
    getAllMilestones: {
      queryKey: ["milestone", "getAll"],
      queryFn: () => kyClient.get("/api/milestones").json<MilestoneDTO[]>(),
    },
    getMilestoneByUuid: (uuid: string) => ({
      queryKey: ["milestone", "getById", uuid],
      queryFn: () =>
        kyClient.get(`/api/milestones/${uuid}`).json<MilestoneDTO>(),
    }),
    createMilestone: (milestone: MilestoneDTO) => ({
      queryKey: ["milestone", "create"],
      queryFn: () =>
        kyClient
          .post("/api/milestones/createMilestone", { json: milestone })
          .json<MilestoneDTO>(),
    }),
    updateMilestone: (uuid: string, milestone: MilestoneDTO) => ({
      queryKey: ["milestone", "update", uuid],
      queryFn: () =>
        kyClient
          .patch(`/api/milestones/${uuid}`, { json: milestone })
          .json<MilestoneDTO>(),
    }),
    deleteMilestone: (uuid: string) => ({
      queryKey: ["milestone", "delete", uuid],
      queryFn: () => kyClient.delete(`/api/milestones/${uuid}`).json<void>(),
    }),
  },
} as const;
