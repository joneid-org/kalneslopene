import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import { tagColor, useTags } from "@/lib/newsUtils.ts";
import { getDayMonthAndYear } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export function TagNewsFeed({ post, img }: { post: NewsFeedDTO; img: string }) {
  const displayImg = post.headerImage ?? img;
  const tags = useTags();

  return (
    <Link to={`/nyheter/${post.uuid}`} className="block group">
      <Card className="overflow-hidden border-blue-100 hover:shadow-lg transition-all">
        <div className="grid sm:grid-cols-[1fr_260px]">
          <div className="order-2 sm:order-1">
            <CardHeader className="pb-2 pt-5 sm:pt-6">
              <div className="flex flex-wrap gap-1.5 mb-1">
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
              <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
                {post.header}
              </h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-900 leading-relaxed line-clamp-4">
                {post.content}
              </p>
            </CardContent>
            <CardFooter className="flex items-center justify-between pt-0">
              <time className="text-xs text-gray-400 font-medium">
                {getDayMonthAndYear(post.date.toISOString())}
              </time>
            </CardFooter>
          </div>
          <div className="h-52 sm:h-auto overflow-hidden order-1 sm:order-2 mb-4 sm:mb-0">
            <img
              src={displayImg}
              alt={post.header}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </Card>
    </Link>
  );
}
