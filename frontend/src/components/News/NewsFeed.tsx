/** biome-ignore-all lint/suspicious/noArrayIndexKey: dot indicators by index is fine */
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Newspaper } from "lucide-react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Card, CardFooter, CardHeader } from "@/components/ui/card.tsx";
import { NEWS_IMAGES, tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getNewsFeed(0, 3));
  const tags = useTags();

  if (!newsfeeds || newsfeeds.totalElements === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="size-10 text-gray-200" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const COLS = 3;
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
          <Card
            key={post.uuid}
            className="overflow-hidden rounded-2xl card-hover hover:shadow-md h-full flex flex-col gap-0 py-0"
          >
            <Link
              to={`/nyheter/${post.uuid}`}
              className="hidden sm:block group"
            >
              <div className="aspect-video overflow-hidden shrink-0 bg-muted">
                <img
                  src={
                    post.headerImage?.url ??
                    NEWS_IMAGES[idx % NEWS_IMAGES.length] ??
                    ""
                  }
                  alt={post.header}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </Link>
            <CardHeader className="px-3.5 sm:px-5 pt-3.5 sm:pt-4 pb-1 gap-2">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    to={`/nyheter/tag/${tag.toLowerCase()}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span
                      className="tag-pill rounded-full bg-secondary px-2.5 py-1"
                      style={{ color: tagColor(tag, tags) }}
                    >
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                key={post.uuid}
                to={`/nyheter/${post.uuid}`}
                className="block group"
              >
                <p className="font-display text-base sm:text-lg font-bold transition-colors leading-snug line-clamp-2">
                  {post.header}
                </p>
                <p className="text-sm text-muted-foreground leading-snug line-clamp-2 mt-1">
                  {post.content
                    .replace(/<[^>]+>/g, " ")
                    .replace(/\s+/g, " ")
                    .trim()}
                </p>
              </Link>
            </CardHeader>
            <CardFooter className="px-3.5 sm:px-5 pb-3.5 sm:pb-5 pt-2 sm:pt-3 mt-auto">
              <time className="text-xs lowercase text-muted-foreground">
                {formatDateFull(post.date)}
              </time>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
