import { Link } from "react-router";
import { Card, CardFooter, CardHeader } from "@/components/ui/card.tsx";
import { tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export function NewsCard({ post, img }: { post: NewsFeedDTO; img: string }) {
  const tags = useTags();

  return (
    <Card className="overflow-hidden rounded-2xl card-hover hover:shadow-md h-full flex flex-col gap-0 py-0">
      <Link to={`/nyheter/${post.uuid}`} className="hidden sm:block group">
        <div className="aspect-video overflow-hidden shrink-0 bg-muted">
          <img
            src={post.headerImage?.url ?? img}
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
              <span className="tag-pill" style={{ color: tagColor(tag, tags) }}>
                {tag}
              </span>
            </Link>
          ))}
        </div>
        <Link to={`/nyheter/${post.uuid}`} className="block group">
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
  );
}
