export type RaceDTO = {
  id: string;
  raceDate: Date;
  weather: string;
};

export type NewsFeedDTO = {
  uuid: string;
  tags: string[];
  header: string;
  content: string;
  date: Date;
};
export type OrganizerDTO = {
  uuid: string;
  name: string;
  responsibility: string;
  initials: string;
  phone: string;
  email?: string;
};
