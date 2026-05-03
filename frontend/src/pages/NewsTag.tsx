import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { TagNewsFeed } from "@/components/News/TagNewsFeed.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { NEWS_IMAGES, tagBg } from "@/lib/newsUtils.ts";

export function NewsTag() {
  const { tag } = useParams<{ tag: string }>();
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  const filtered = (newsfeeds ?? []).filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag?.toLowerCase()),
  );

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
            className={`${tagBg(tag ?? "")} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}
          >
            {tag}
          </span>
          <span className="text-sm text-gray-500">
            {filtered.length} nyheter
          </span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-16">
          Ingen nyheter med denne taggen.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map((post, idx) => (
            <TagNewsFeed
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
