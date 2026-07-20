import { kyClient } from "@/api/queryClient.ts";
import type {
  LoginRequest,
  LoginResponse,
  MilestoneDTO,
  MilestoneInput,
  NewsFeedDTO,
  NewsFeedInput,
  NewsfeedSettingsDTO,
  NewsfeedTagDTO,
  NewsfeedTagInput,
  OrganizerDTO,
  OrganizerInput,
  RaceDTO,
  RaceRunnerDTO,
  RunnerDTO,
  RunnerInput,
} from "../model/DTO.ts";

export const MUTATIONS = {
  race: {
    updateRace: (uuid: string, race: RaceDTO) =>
      kyClient.patch(`/api/races/${uuid}`, { json: race }).json<RaceDTO>(),
    deleteRace: (uuid: string) =>
      kyClient.delete(`/api/races/${uuid}`).json<void>(),
    addRunnersToRace: (raceUuid: string, runners: RaceRunnerDTO[]) =>
      kyClient
        .post(`/api/races/${raceUuid}/runners`, { json: runners })
        .json<RaceRunnerDTO[]>(),
    updateRunnerInRace: (
      raceUuid: string,
      runnerUuid: string,
      runner: RaceRunnerDTO,
    ) =>
      kyClient
        .patch(`/api/races/${raceUuid}/runners/${runnerUuid}`, {
          json: runner,
        })
        .json<RaceRunnerDTO>(),
    removeRunnersFromRace: (raceUuid: string, runnerUuids: string[]) =>
      kyClient
        .delete(`/api/races/${raceUuid}/runners`, { json: runnerUuids })
        .json<void>(),
    publishResults: (raceUuid: string) =>
      kyClient.post(`/api/races/${raceUuid}/publish`).json<RaceDTO>(),
  },
  organizer: {
    createOrganizer: (organizer: OrganizerInput) =>
      kyClient
        .post("/api/organizers/createOrganizer", { json: organizer })
        .json<OrganizerDTO>(),
    updateOrganizer: (uuid: string, organizer: OrganizerDTO) =>
      kyClient
        .patch(`/api/organizers/${uuid}`, { json: organizer })
        .json<OrganizerDTO>(),
    deleteOrganizer: (uuid: string) =>
      kyClient.delete(`/api/organizers/${uuid}`).json<void>(),
  },
  runner: {
    createRunners: (runners: RunnerInput[]) =>
      kyClient.post("/api/runners", { json: runners }).json<RunnerDTO[]>(),
    updateRunner: (uuid: string, runner: RunnerDTO) =>
      kyClient
        .patch(`/api/runners/${uuid}`, { json: runner })
        .json<RunnerDTO>(),
    deleteRunner: (uuid: string) =>
      kyClient.delete(`/api/runners/${uuid}`).json<void>(),
  },
  newsfeed: {
    createNewsFeed: async (newsfeed: NewsFeedInput) => {
      const { headerImage, ...rest } = newsfeed;
      const data = await kyClient
        .post("/api/newsfeeds/createNewsfeed", {
          json: { ...rest, headerImageUuid: headerImage?.uuid },
        })
        .json<NewsFeedDTO>();
      return { ...data, date: new Date(data.date) };
    },
    updateNewsFeed: async (uuid: string, newsfeed: NewsFeedDTO) => {
      const { headerImage, ...rest } = newsfeed;
      const data = await kyClient
        .patch(`/api/newsfeeds/${uuid}`, {
          json: { ...rest, headerImageUuid: headerImage?.uuid },
        })
        .json<NewsFeedDTO>();
      return { ...data, date: new Date(data.date) };
    },
    deleteNewsFeed: (uuid: string) =>
      kyClient.delete(`/api/newsfeeds/${uuid}`).json<void>(),
    updateSettings: (dto: NewsfeedSettingsDTO) =>
      kyClient
        .patch("/api/newsfeeds/settings", { json: dto })
        .json<NewsfeedSettingsDTO>(),
    createTag: (dto: NewsfeedTagInput) =>
      kyClient
        .post("/api/newsfeeds/tags", { json: dto })
        .json<NewsfeedTagDTO>(),
    updateTag: (uuid: string, dto: NewsfeedTagDTO) =>
      kyClient
        .patch(`/api/newsfeeds/tags/${uuid}`, { json: dto })
        .json<NewsfeedTagDTO>(),
    deleteTag: (uuid: string) =>
      kyClient.delete(`/api/newsfeeds/tags/${uuid}`).json<void>(),
  },
  auth: {
    login: (request: LoginRequest) =>
      kyClient.post("/api/auth/login", { json: request }).json<LoginResponse>(),
    setup: (request: { username: string; password: string }) =>
      kyClient.post("/api/auth/setup", { json: request }).json<LoginResponse>(),
  },
  milestone: {
    createMilestone: (milestone: MilestoneInput) =>
      kyClient
        .post("/api/milestones/createMilestone", { json: milestone })
        .json<MilestoneDTO>(),
    updateMilestone: (uuid: string, milestone: MilestoneDTO) =>
      kyClient
        .patch(`/api/milestones/${uuid}`, { json: milestone })
        .json<MilestoneDTO>(),
    deleteMilestone: (uuid: string) =>
      kyClient.delete(`/api/milestones/${uuid}`).json<void>(),
  },
} as const;
