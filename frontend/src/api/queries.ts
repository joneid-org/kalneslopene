import { kyClient } from "@/api/queryClient.ts";
import type { RaceFilter } from "@/api/types.ts";
import type {
  ConfigDTO,
  MilestoneDTO,
  NewsFeedDTO,
  NewsfeedSettingsDTO,
  NewsfeedTagDTO,
  OrganizerDTO,
  PagedResponse,
  RaceDTO,
  RaceInput,
  RaceResultSummaryDTO,
  RaceRunnerDTO,
  RaceStatisticsDTO,
  RunnerDTO,
  S3FileDto,
} from "../model/DTO.ts";

export function requestNewsfeedHeaderUpload(fileName: string) {
  return kyClient
    .post("/api/newsfeeds/header-image", { searchParams: { fileName } })
    .json<{ uploadUrl: string; s3File: S3FileDto }>();
}

export function requestNewsfeedContentUpload(fileName: string) {
  return kyClient
    .post("/api/newsfeeds/content-image", { searchParams: { fileName } })
    .json<{ uploadUrl: string; s3File: S3FileDto }>();
}

export const QUERIES = {
  config: {
    get: {
      queryKey: ["config"],
      queryFn: () => kyClient.get("/api/config").json<ConfigDTO>(),
      staleTime: Number.POSITIVE_INFINITY,
    },
  },
  race: {
    getAllRaces: (filter?: RaceFilter) => ({
      queryKey: ["race", "getAll", filter],
      queryFn: async () => {
        const searchParams: Record<string, string> = {};
        if (filter?.from)
          searchParams.from = filter.from.toISOString().slice(0, 19);
        if (filter?.to) searchParams.to = filter.to.toISOString().slice(0, 19);
        return await kyClient
          .get("/api/races", { searchParams })
          .json<RaceDTO[]>();
      },
    }),
    getRaceByUuid: (uuid: string) => ({
      queryKey: ["race", "getById", uuid],
      queryFn: async () => {
        return await kyClient.get(`/api/races/${uuid}`).json<RaceDTO>();
      },
    }),
    getAllRunnersInRace: (uuid: string) => ({
      queryKey: ["race", uuid, "runnersInRace"],
      queryFn: async () => {
        return await kyClient
          .get(`/api/races/${uuid}/runners`)
          .json<RaceRunnerDTO[]>();
      },
    }),
    getResultSummary: (uuid: string) => ({
      queryKey: ["race", uuid, "resultSummary"],
      queryFn: async () => {
        return await kyClient
          .get(`/api/races/${uuid}/results/summary`)
          .json<RaceResultSummaryDTO>();
      },
    }),
  },
  statistics: {
    race: (year?: number) => ({
      queryKey: ["statistics", "race", year],
      queryFn: () =>
        kyClient
          .get("/api/statistics/races", { searchParams: { year } })
          .json<RaceStatisticsDTO>(),
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
    getNewsFeed: (page: number, pageSize: number, tag?: string) => ({
      queryKey: ["newsfeed", "page", page, pageSize, tag],
      queryFn: async () => {
        const searchParams: Record<string, string | number> = {
          page,
          pageSize,
        };
        if (tag) searchParams.tag = tag;
        const data = await kyClient
          .get("/api/newsfeeds", { searchParams })
          .json<PagedResponse<NewsFeedDTO>>();
        return {
          ...data,
          content: data.content.map((feed) => ({
            ...feed,
            date: new Date(feed.date),
          })),
        };
      },
    }),
    getNewsFeedByUuid: (uuid: string) => ({
      queryKey: ["newsfeed", "getById", uuid],
      queryFn: async () => {
        const data = await kyClient
          .get(`/api/newsfeeds/${uuid}`)
          .json<NewsFeedDTO>();
        return { ...data, date: new Date(data.date) };
      },
    }),
    getSettings: {
      queryKey: ["newsfeed", "settings"],
      queryFn: () =>
        kyClient.get("/api/newsfeeds/settings").json<NewsfeedSettingsDTO>(),
    },
    getAllTags: {
      queryKey: ["newsfeed", "tags"],
      queryFn: () =>
        kyClient.get("/api/newsfeeds/tags").json<NewsfeedTagDTO[]>(),
    },
  },
  auth: {
    isSetupNeeded: {
      queryKey: ["auth", "setup", "needed"],
      queryFn: () =>
        kyClient.get("/api/auth/setup/needed").json<{ needed: boolean }>(),
    },
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
  },
} as const;
