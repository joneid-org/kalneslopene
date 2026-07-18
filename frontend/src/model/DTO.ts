export interface S3FileDto {
  uuid: string;
  url: string;
  description?: string;
}

export interface ConfigDTO {
  s3BaseUrl: string;
}

export type WeatherDto = {
  symbol: string;
  temperature: number;
  windSpeed: number;
  precipitation: number;
};

export type RaceDTO = {
  uuid: string;
  raceDate: string;
  weather?: WeatherDto;
  courseCondition?: string;
  weatherManuallyEdited: boolean;
  runnerCount: number;
  photos: S3FileDto[];
};
export type RaceInput = Omit<
  RaceDTO,
  "uuid" | "runnerCount" | "photos" | "weatherManuallyEdited"
>;

export type NewsFeedDTO = {
  uuid: string;
  tags: string[];
  header: string;
  content: string;
  date: Date;
  headerImage?: S3FileDto;
  images?: string[];
};
export type NewsFeedInput = Omit<NewsFeedDTO, "uuid">;

export type PagedResponse<T> = {
  content: T[];
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export type NewsfeedTagDTO = {
  value: string;
  color: string;
};
export type NewsfeedTagInput = Omit<NewsfeedTagDTO, "value">;

export type NewsfeedSettingsDTO = {
  maxArticles: number;
};

export type OrganizerDTO = {
  uuid: string;
  name: string;
  responsibility: string[];
  initials: string;
  phone?: string;
  email?: string;
  contactPerson: boolean;
  image?: string;
};
export type OrganizerInput = Omit<OrganizerDTO, "uuid">;

export type RunnerDTO = {
  uuid: string;
  name: string;
  gender: string;
  pr?: string;
};
export type RunnerInput = Omit<RunnerDTO, "uuid">;

export type RaceRunnerDTO = {
  runner: RunnerDTO;
  raceUuid: string;
  resultTime: string;
  hideTime: boolean;
  previousSeasonBest?: string;
  previousPersonalRecord?: string;
  totalRaces: number;
};

export type RaceResultSummaryDTO = {
  participants: number;
  male: number;
  female: number;
  seasonBestCount: number;
  personalBestCount: number;
  debutantCount: number;
};

export type MilestoneDTO = {
  uuid: string;
  year: string;
  icon: string;
  title: string;
  summary: string;
  extra?: string;
  details: string[];
};
export type MilestoneInput = Omit<MilestoneDTO, "uuid">;

export type RaceStatisticsDTO = {
  completedRaces: number;
  upcomingRaces: number;
  uniqueRunners: {
    male: number;
    female: number;
    total: number;
  };
  averageRunnersPerRace: number;
  courseRecord?: RaceRunnerDTO;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  username: string;
  roles: string[];
};
