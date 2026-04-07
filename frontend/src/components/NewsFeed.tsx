import { useQuery } from "@tanstack/react-query";
import { Newspaper } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  return (
    <section className="space-y-6">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 rounded-full bg-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Siste nytt
        </h2>
        <Newspaper className="size-4 text-gray-400 ml-1" />
      </div>

      {newsfeeds && newsfeeds.length > 0 ? (
        <div className="space-y-0">
          {newsfeeds.map((post, idx) => (
            <article
              key={post.uuid}
              className={`group relative py-5 ${
                idx !== 0 ? "border-t border-gray-200" : ""
              } hover:bg-white/60 rounded-xl px-4 -mx-4 transition-colors`}
            >
              {/* Blue left dot on hover */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-0 group-hover:h-10 bg-blue-500 rounded-full transition-all duration-200" />

              <div className="flex flex-wrap gap-1.5 mb-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="text-xs bg-blue-50 text-blue-600 border-blue-100"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              <h3 className="font-semibold text-gray-900 leading-snug mb-1">
                {post.header}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-2">
                {post.content}
              </p>
              <p className="text-xs text-gray-400">
                {formatDateFull(post.date)}
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 py-4">Ingen nyheter ennå.</p>
      )}
    </section>
  );
}
