import { infiniteQueryOptions } from "@tanstack/react-query";
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
  RaceInfoDTO,
  RaceResultSummaryDTO,
  RaceRunnerDTO,
  RaceStatisticsDTO,
  RunnerDTO,
  RunnerOverviewStatsDTO,
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

export function nextPageParam<T>(
  lastPage: PagedResponse<T>,
): number | undefined {
  const next = lastPage.page + 1;
  return next < lastPage.totalPages ? next : undefined;
}

export function previousPageParam<T>(
  firstPage: PagedResponse<T>,
): number | undefined {
  return firstPage.page > 0 ? firstPage.page - 1 : undefined;
}

export const DEFAULT_RACE_PAGE_SIZE = 20;

function fetchRaces(
  filter: RaceFilter | undefined,
  page: number,
  pageSize: number | undefined | null,
) {
  const searchParams: Record<string, string> = { page: page.toString() };
  if (pageSize !== undefined && pageSize !== null)
    searchParams.pageSize = pageSize.toString();
  if (filter?.from) searchParams.from = filter.from;
  if (filter?.to) searchParams.to = filter.to;
  if (filter?.isPublished !== undefined)
    searchParams.isPublished = String(filter.isPublished);
  return kyClient
    .get("/api/races", { searchParams })
    .json<PagedResponse<RaceDTO>>();
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
    getAllRaceInfos: ({ isPublished }: { isPublished?: boolean } = {}) => ({
      queryKey: ["race", "getAllRaceInfos", isPublished],
      queryFn: async () =>
        await kyClient
          .get("/api/race-info", { searchParams: { isPublished } })
          .json<RaceInfoDTO[]>(),
    }),
    getRaces: ({
      filter,
      page = 0,
      pageSize = DEFAULT_RACE_PAGE_SIZE,
    }: {
      filter?: RaceFilter;
      page?: number;
      pageSize?: number | null;
    } = {}) => ({
      queryKey: ["race", "getAll", filter, page, pageSize],
      queryFn: () => fetchRaces(filter, page, pageSize),
    }),
    getRacesInfinite: ({
      filter,
      pageSize = DEFAULT_RACE_PAGE_SIZE,
    }: {
      filter?: RaceFilter;
      pageSize?: number;
    } = {}) =>
      infiniteQueryOptions({
        queryKey: ["race", "getAllInfinite", filter, pageSize],
        queryFn: ({ pageParam }) => fetchRaces(filter, pageParam, pageSize),
        initialPageParam: 0,
        getNextPageParam: nextPageParam,
        getPreviousPageParam: previousPageParam,
      }),
    getNextRace: () => ({
      queryKey: ["race", "next"],
      queryFn: async () => {
        const response = await kyClient.get("/api/race-next");
        return response.status === 204 ? null : await response.json<RaceDTO>();
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
    runnerOverview: () => ({
      queryKey: ["statistics", "runnerOverview"],
      queryFn: () =>
        kyClient
          .get("/api/statistics/runners/overview")
          .json<RunnerOverviewStatsDTO>(),
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
    getRunners: (name?: string, isVerified?: boolean) => ({
      queryKey: ["runner", "getAll", name, isVerified],
      queryFn: () => {
        const searchParams: Record<string, string | boolean> = {};
        if (name) searchParams.name = name;
        if (isVerified !== undefined) searchParams.isVerified = isVerified;
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
