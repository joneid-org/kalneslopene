/** biome-ignore-all lint/suspicious/noArrayIndexKey: dot indicators by index is fine */
import { useQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import {
  CompactListStory,
  CompactStory,
  FeaturedStory,
  NEWS_IMAGES,
} from "@/components/NewsFeedStories.tsx";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  if (!newsfeeds || newsfeeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="size-10 text-gray-200" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const latest = newsfeeds[0];
  if (!latest) return null;
  const older = newsfeeds.slice(1);

  return (
    <div className="flex flex-col gap-4">
      {/* Latest — featured */}
      <FeaturedStory
        post={latest}
        img={NEWS_IMAGES[newsfeeds.length % NEWS_IMAGES.length] ?? ""}
      />

      {/* Older posts */}
      {older.length > 0 && (
        <>
          {/* Mobile: compact vertical list */}
          <div className="flex flex-col sm:hidden">
            {older.map((post, idx) => (
              <CompactListStory
                key={post.uuid}
                post={post}
                img={NEWS_IMAGES[idx % NEWS_IMAGES.length] ?? ""}
              />
            ))}
          </div>

          {/* Desktop: horizontal scroll row with fade hint */}
          <div className="hidden sm:block relative">
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
              {older.map((post, idx) => (
                <CompactStory
                  key={post.uuid}
                  post={post}
                  img={NEWS_IMAGES[idx % NEWS_IMAGES.length] ?? ""}
                />
              ))}
            </div>
            {/* Right-edge fade to hint at more content */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-16 bg-linear-to-l from-white to-transparent" />
          </div>
        </>
      )}
    </div>
  );
}
