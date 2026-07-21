import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Newspaper } from "lucide-react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { NewsCard } from "@/components/News/NewsCard.tsx";
import { NEWS_IMAGES } from "@/lib/newsUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

const COLS = 3;

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getNewsFeed(0, COLS));

  if (!newsfeeds || newsfeeds.totalElements === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="size-10 text-gray-200" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const visible = newsfeeds.content.slice(0, COLS);
  const hasMore = newsfeeds.totalElements > COLS;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display font-extrabold text-lg sm:text-2xl tracking-tight">
          Siste nytt
        </h2>
        {hasMore && (
          <Link
            to="/nyheter"
            className="flex items-center gap-1 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
          >
            Vis flere <ChevronRight className="size-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
        {visible.map((post: NewsFeedDTO, idx) => (
          <NewsCard
            key={post.uuid}
            post={post}
            img={NEWS_IMAGES[idx % NEWS_IMAGES.length] ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
