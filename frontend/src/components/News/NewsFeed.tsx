/** biome-ignore-all lint/suspicious/noArrayIndexKey: dot indicators by index is fine */
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Newspaper } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardFooter, CardHeader } from "@/components/ui/card.tsx";
import { NEWS_IMAGES, tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);
  const [expanded, setExpanded] = useState(false);
  const tags = useTags();

  if (!newsfeeds || newsfeeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="size-10 text-gray-200" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const COLS = 3;
  const visible = expanded ? newsfeeds : newsfeeds.slice(0, COLS);
  const hasMore = newsfeeds.length > COLS;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {visible.map((post: NewsFeedDTO, idx) => (
          <Link
            key={post.uuid}
            to={`/nyheter/${post.uuid}`}
            className="block group"
          >
            <Card className="overflow-hidden card-hover hover:shadow-2xl h-full flex flex-col gap-0 py-0">
              <div className="aspect-video overflow-hidden shrink-0">
                <img
                  src={
                    post.headerImage ??
                    NEWS_IMAGES[idx % NEWS_IMAGES.length] ??
                    ""
                  }
                  alt={post.header}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <CardHeader className="px-2 pt-3 pb-1 gap-1">
                <div className="flex flex-wrap gap-1 mb-1">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag}
                      to={`/nyheter/tag/${tag.toLowerCase()}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <span
                        className="tag-pill"
                        style={{ color: tagColor(tag, tags) }}
                      >
                        {tag}
                      </span>
                    </Link>
                  ))}
                </div>
                <p className="text-md font-bold transition-colors leading-snug line-clamp-2">
                  {post.header}
                </p>
                <p className="text-sm leading-snug line-clamp-2">
                  {post.content}
                </p>
              </CardHeader>
              <CardFooter className="px-2 pb-3 pt-1 mt-auto flex flex-wrap items-center justify-end gap-1">
                <time className="text-xs lowercase text-muted-foreground">
                  {" "}
                  {formatDateFull(post.date)}
                </time>
              </CardFooter>
            </Card>
          </Link>
        ))}
      </div>

      {hasMore && (
        <Button
          variant="ghost"
          size="sm"
          className="mx-auto font-semibold gap-1"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? (
            <>
              <ChevronUp className="size-4" /> Vis færre
            </>
          ) : (
            <>
              <ChevronDown className="size-4" /> Vis flere
            </>
          )}
        </Button>
      )}
    </div>
  );
}
