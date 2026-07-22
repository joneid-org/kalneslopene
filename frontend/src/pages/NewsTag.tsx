import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { NewsCard } from "@/components/News/NewsCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { NEWS_IMAGES, tagColor, useTags } from "@/lib/newsUtils.ts";

const ARCHIVE_SIZE = 100;

export function NewsTag() {
  const { tag } = useParams<{ tag: string }>();
  const { data } = useQuery(QUERIES.newsfeed.getNewsFeed(0, ARCHIVE_SIZE, tag));
  const tags = useTags();

  const newsFeed = data?.content ?? [];

  return (
    <div className="page-content-sm">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="size-4" />
            Tilbake
          </Button>
        </Link>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <span
            className="tag-pill"
            style={{ color: tagColor(tag ?? "", tags) }}
          >
            {tag}
          </span>
          <span className="text-sm text-gray-500">
            {newsFeed.length} nyheter
          </span>
        </div>
      </div>

      {newsFeed.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">
          Ingen nyheter med denne taggen.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
          {newsFeed.map((post, idx) => (
            <NewsCard
              key={post.uuid}
              post={post}
              img={NEWS_IMAGES[idx % NEWS_IMAGES.length] ?? ""}
            />
          ))}
        </div>
      )}
    </div>
  );
}
