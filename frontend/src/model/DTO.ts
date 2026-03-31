export type RaceDTO = {
  uuid?: string;
  raceDate: Date;
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
