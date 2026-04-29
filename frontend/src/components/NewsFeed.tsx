/** biome-ignore-all lint/suspicious/noArrayIndexKey: dot indicators by index is fine */
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Newspaper } from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { CompactStory, NEWS_IMAGES } from "@/components/NewsFeedStories.tsx";
import { Button } from "@/components/ui/button.tsx";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);
  const [expanded, setExpanded] = useState(false);

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
        {visible.map((post, idx) => (
          <CompactStory
            key={post.uuid}
            post={post}
            img={NEWS_IMAGES[idx % NEWS_IMAGES.length] ?? ""}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            className=" font-semibold gap-1"
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
        </div>
      )}
    </div>
  );
}
