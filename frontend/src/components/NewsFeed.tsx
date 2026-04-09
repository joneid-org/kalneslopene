import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Newspaper } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

// Cycling running images for news cards
const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?w=800&q=80",
  "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?w=800&q=80",
  "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?w=800&q=80",
  "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?w=800&q=80",
  "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?w=800&q=80",
];

const TAG_COLORS: Record<string, string> = {
  resultat: "bg-emerald-100 text-emerald-700",
  info: "bg-orange-100 text-orange-700",
  jubileum: "bg-purple-100 text-purple-700",
  arrangement: "bg-pink-100 text-pink-700",
};
function tagStyle(tag: string) {
  return TAG_COLORS[tag.toLowerCase()] ?? "bg-blue-100 text-blue-700";
}

function FeaturedCard({ post, img }: { post: NewsFeedDTO; img: string }) {
  return (
    <article className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      {/* Image */}
      <div className="relative h-52 sm:h-64 overflow-hidden">
        <img
          src={img}
          alt={post.header}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient over image */}
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        {/* Tags on image */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold uppercase tracking-wide bg-blue-600 text-white px-2 py-0.5 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        {/* Date on image */}
        <p className="absolute bottom-3 left-4 text-xs text-white/70">
          {formatDateFull(post.date)}
        </p>
      </div>
      {/* Text */}
      <div className="bg-white px-5 py-4">
        <h3 className="font-bold text-gray-900 text-base leading-snug mb-1 group-hover:text-blue-600 transition-colors">
          {post.header}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
          {post.content}
        </p>
      </div>
    </article>
  );
}

function CompactCard({ post, img }: { post: NewsFeedDTO; img: string }) {
  return (
    <article className="group flex gap-3 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className="w-24 h-24 shrink-0 overflow-hidden">
        <img
          src={img}
          alt={post.header}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      {/* Text */}
      <div className="flex-1 min-w-0 py-3 pr-4 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap gap-1 mb-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${tagStyle(
                  tag,
                )}`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {post.header}
          </h3>
        </div>
        <p className="text-[11px] text-gray-400 mt-1">
          {formatDateFull(post.date)}
        </p>
      </div>
      <div className="flex items-center pr-3 shrink-0">
        <ArrowRight className="size-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
      </div>
    </article>
  );
}

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  if (!newsfeeds || newsfeeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
        <Newspaper className="size-8" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const [featured, ...rest] = newsfeeds;

  return (
    <div className="space-y-4">
      {/* Featured */}
      <FeaturedCard post={featured} img={NEWS_IMAGES[0] ?? ""} />

      {/* Compact list */}
      {rest.map((post, idx) => (
        <CompactCard
          key={post.uuid}
          post={post}
          img={NEWS_IMAGES[(idx + 1) % NEWS_IMAGES.length] ?? ""}
        />
      ))}
    </div>
  );
}
