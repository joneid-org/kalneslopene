export type RaceDTO = {
  uuid: string;
  raceDate: string;
  weather?: string;
  runnerCount: number;
};
export type RaceInput = Omit<RaceDTO, "uuid" | "runnerCount">;

export type NewsFeedDTO = {
  uuid: string;
  tags: string[];
  header: string;
  content: string;
  date: Date;
  headerImage?: string;
  images?: string[];
};
export type NewsFeedInput = Omit<NewsFeedDTO, "uuid">;

export type NewsfeedTagDTO = {
  uuid: string;
  label: string;
  value: string;
  color: string;
};
export type NewsfeedTagInput = Omit<NewsfeedTagDTO, "uuid">;

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
  race: RaceDTO;
  resultTime: string;
  hideTime: boolean;
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

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  username: string;
  roles: string[];
};

export type YrTimeseries = {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature: number;
        wind_speed: number;
        cloud_area_fraction: number;
      };
    };
    next_1_hours?: {
      summary: { symbol_code: string };
      details: { precipitation_amount: number };
    };
    next_6_hours?: {
      summary: { symbol_code: string };
      details: { precipitation_amount: number };
    };
  };
};

export type YrForecast = {
  properties: { timeseries: YrTimeseries[] };
};
