import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper, Sparkles, Tag } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

const TAG_COLORS: Record<string, string> = {
  "l\u00f8p": "bg-blue-100 text-blue-700",
  resultat: "bg-emerald-100 text-emerald-700",
  info: "bg-orange-100 text-orange-700",
  jubileum: "bg-purple-100 text-purple-700",
  arrangement: "bg-pink-100 text-pink-700",
};

function tagColor(tag: string): string {
  const key = tag.toLowerCase();
  return TAG_COLORS[key] ?? "bg-gray-100 text-gray-600";
}

function FeaturedPost({ post }: { post: NewsFeedDTO }) {
  return (
    <article className="relative overflow-hidden rounded-2xl bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 text-white shadow-xl shadow-blue-200/50 group cursor-default">
      {/* Decorative circles */}
      <div className="absolute -top-8 -right-8 size-40 rounded-full bg-white/5" />
      <div className="absolute -bottom-12 -right-4 size-56 rounded-full bg-white/5" />
      <div className="absolute top-4 right-4 text-white/20">
        <Sparkles className="size-16" />
      </div>

      <div className="relative z-10 p-6 sm:p-8">
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Heading */}
        <h3 className="text-xl sm:text-2xl font-extrabold leading-tight mb-3 drop-shadow">
          {post.header}
        </h3>

        {/* Content */}
        <p className="text-blue-100 text-sm sm:text-base leading-relaxed mb-5 line-clamp-3">
          {post.content}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-blue-200 font-medium">
            {formatDateFull(post.date)}
          </span>
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
            Les mer <ArrowRight className="size-3" />
          </span>
        </div>
      </div>
    </article>
  );
}

const ACCENT_COLORS = [
  "border-blue-500 bg-blue-50/50",
  "border-emerald-500 bg-emerald-50/50",
  "border-orange-500 bg-orange-50/50",
  "border-purple-500 bg-purple-50/50",
  "border-pink-500 bg-pink-50/50",
];

function CompactPost({ post, index }: { post: NewsFeedDTO; index: number }) {
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  return (
    <article
      className={`group relative flex gap-4 rounded-xl border-l-4 ${accent} px-4 py-4 hover:shadow-md transition-all duration-200 cursor-default`}
    >
      <div className="flex-1 min-w-0">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${tagColor(tag)}`}
            >
              <Tag className="size-2.5 inline mr-0.5" />
              {tag}
            </span>
          ))}
        </div>
        <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 group-hover:text-blue-700 transition-colors">
          {post.header}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
          {post.content}
        </p>
      </div>
      <div className="shrink-0 text-right flex flex-col items-end justify-between">
        <span className="text-xs text-gray-400 whitespace-nowrap">
          {formatDateFull(post.date)}
        </span>
        <ArrowRight className="size-3.5 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </article>
  );
}

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  const [featured, ...rest] = newsfeeds ?? [];

  return (
    <section className="space-y-5">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 rounded-full bg-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Siste nytt
        </h2>
        <Newspaper className="size-4 text-gray-400 ml-1" />
        {newsfeeds && newsfeeds.length > 0 && (
          <span className="ml-auto text-xs text-gray-400 font-medium">
            {newsfeeds.length} innlegg
          </span>
        )}
      </div>

      {newsfeeds && newsfeeds.length > 0 ? (
        <div className="space-y-3">
          {/* Featured first post */}
          <FeaturedPost post={featured} />

          {/* Remaining posts */}
          {rest.map((post, idx) => (
            <CompactPost key={post.uuid} post={post} index={idx} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400 gap-2">
          <Newspaper className="size-8 text-gray-300" />
          <p className="text-sm">Ingen nyheter ennå.</p>
        </div>
      )}
    </section>
  );
}
