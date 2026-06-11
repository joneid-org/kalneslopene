import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";
import type { NewsFeedDTO, NewsfeedTagDTO, RaceDTO } from "@/model/DTO.ts";

export const PREDEFINED_TAGS: NewsfeedTagDTO[] = [
  { value: "resultater", color: "#2563eb" },
  { value: "bilder", color: "#9333ea" },
  { value: "kommende løp", color: "#16a34a" },
  { value: "ukens løp", color: "#f97316" },
];

export function tagColor(tag: string, tags?: NewsfeedTagDTO[]): string {
  const list = tags ?? PREDEFINED_TAGS;
  return (
    list.find((t) => t.value.toLowerCase() === tag.toLowerCase())?.color ??
    "#000000"
  );
}

export function useTags(): NewsfeedTagDTO[] {
  const { data } = useQuery(QUERIES.newsfeed.getAllTags);
  return data && data.length > 0 ? data : PREDEFINED_TAGS;
}

export const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?w=600&q=75",
  "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?w=600&q=75",
  "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?w=600&q=75",
  "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?w=600&q=75",
  "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?w=600&q=75",
];

export function sameDate(a: unknown, b: Date): boolean {
  const aStr = String(a).slice(0, 10);
  const bStr = `${b.getFullYear()}-${String(b.getMonth() + 1).padStart(2, "0")}-${String(b.getDate()).padStart(2, "0")}`;
  return aStr === bStr;
}

export function findRaceForPost(
  races: RaceDTO[],
  post: NewsFeedDTO,
): RaceDTO | undefined {
  const hasResultTag = post.tags.some((t) =>
    ["resultat", "resultater"].includes(t.toLowerCase()),
  );
  if (!hasResultTag) return undefined;
  return races.find((r) => sameDate(r.raceDate, post.date));
}
