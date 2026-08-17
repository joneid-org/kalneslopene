/** `from`/`to` are local "YYYY-MM-DDTHH:MM:SS" strings — the backend reads them as LocalDateTime. */
export type RaceFilter = {
  from?: string;
  to?: string;
  isPublished?: boolean;
  containsPictures?: boolean;
};
