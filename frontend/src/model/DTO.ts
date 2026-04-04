export type RaceDTO = {
  uuid?: string;
  raceDate: string;
  weather?: string;
};

export type NewsFeedDTO = {
  uuid?: string;
  tags: string[];
  header: string;
  content: string;
  date: Date;
};

export type OrganizerDTO = {
  uuid?: string;
  name: string;
  responsibility: string[];
  initials: string;
  phone?: string;
  email?: string;
  contactPerson: boolean;
};

export type RunnerDTO = {
  uuid?: string;
  name: string;
  gender: string;
};

export type RaceRunnerDTO = {
  runner: RunnerDTO;
  race: RaceDTO;
  resultTime: string;
  hideTime: boolean;
};

export type MilestoneDTO = {
  uuid?: string;
  year: string;
  icon: string;
  title: string;
  summary: string;
  extra?: string;
  details: string[];
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  username: string;
  roles: string[];
};
