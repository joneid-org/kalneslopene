import { kyClient } from "@/api/queryClient.ts";
import type {
  InviteDTO,
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
  RaceInput,
  RaceRunnerDTO,
  ReorderOrganizerInput,
  ReorderPhotoInput,
  RunnerDTO,
  RunnerInput,
  S3FileDto,
  UserDTO,
  UserRole,
} from "../model/DTO.ts";

export type PresignedUpload = { uploadUrl: string; s3File: S3FileDto };

export const MUTATIONS = {
  race: {
    createRaces: (races: RaceInput[]) =>
      kyClient.post("/api/races", { json: races }).json<RaceDTO[]>(),
    updateRace: (uuid: string, race: RaceInput) =>
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
    reorderPhoto: (raceUuid: string, input: ReorderPhotoInput) =>
      kyClient
        .patch(`/api/races/${raceUuid}/photos/order`, { json: input })
        .json<S3FileDto[]>(),
    requestPhotoUploads: (raceUuid: string, fileNames: string[]) =>
      kyClient
        .post(`/api/races/${raceUuid}/photos`, { json: fileNames })
        .json<{ [key in string]: PresignedUpload }>(),
  },
  s3: {
    confirmUploads: (fileUuids: string[]) =>
      kyClient
        .patch("/api/s3/files/confirm-uploads", { json: fileUuids })
        .json<void>(),
    deleteFiles: (fileUuids: string[]) =>
      kyClient.delete("/api/s3/files", { json: fileUuids }).json<void>(),
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
    reorderOrganizer: (input: ReorderOrganizerInput) =>
      kyClient
        .patch("/api/organizers/order", { json: input })
        .json<OrganizerDTO[]>(),
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
    requestHeaderImageUpload: (fileName: string) =>
      kyClient
        .post("/api/newsfeeds/header-image", { searchParams: { fileName } })
        .json<PresignedUpload>(),
    requestContentImageUpload: (fileName: string) =>
      kyClient
        .post("/api/newsfeeds/content-image", { searchParams: { fileName } })
        .json<PresignedUpload>(),
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
    registerWithInvite: (
      token: string,
      request: { username: string; password: string },
    ) =>
      kyClient
        .post(`/api/auth/register/${token}`, { json: request })
        .json<LoginResponse>(),
  },
  user: {
    createInvite: (roles: UserRole[]) =>
      kyClient
        .post("/api/users/invites", { json: { roles } })
        .json<InviteDTO>(),
    setRoles: (uuid: string, roles: UserRole[]) =>
      kyClient
        .patch(`/api/users/${uuid}/roles`, { json: { roles } })
        .json<UserDTO>(),
    setBanned: (uuid: string, banned: boolean) =>
      kyClient
        .patch(`/api/users/${uuid}/banned`, { json: { banned } })
        .json<UserDTO>(),
  },
  milestone: {
    createMilestone: (milestone: MilestoneInput) =>
      kyClient
        .post("/api/milestones", { json: milestone })
        .json<MilestoneDTO>(),
    updateMilestone: (uuid: string, milestone: MilestoneInput) =>
      kyClient
        .patch(`/api/milestones/${uuid}`, { json: milestone })
        .json<MilestoneDTO>(),
    deleteMilestone: (uuid: string) =>
      kyClient.delete(`/api/milestones/${uuid}`).json<void>(),
  },
} as const;
