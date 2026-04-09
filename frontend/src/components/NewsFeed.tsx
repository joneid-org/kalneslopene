import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp, Newspaper } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

const TAG_BG: Record<string, string> = {
  resultat: "bg-emerald-500",
  info: "bg-orange-500",
  jubileum: "bg-purple-500",
  arrangement: "bg-pink-500",
};
function tagBg(tag: string) {
  return TAG_BG[tag.toLowerCase()] ?? "bg-blue-600";
}

const BORDER_ACCENTS = [
  "border-blue-500",
  "border-emerald-500",
  "border-orange-500",
  "border-purple-500",
  "border-pink-500",
];

const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?w=600&q=75",
  "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?w=600&q=75",
  "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?w=600&q=75",
  "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?w=600&q=75",
  "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?w=600&q=75",
];

/** Large lead story — text left, image right accent */
function LeadStory({ post, img }: { post: NewsFeedDTO; img: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className="group grid sm:grid-cols-[1fr_180px] w-full text-left rounded-2xl overflow-hidden bg-white border border-gray-100 hover:border-blue-100 hover:shadow-md transition-all cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      <div className="p-6 flex flex-col justify-between gap-3 order-2 sm:order-1">
        <div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`${tagBg(tag)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight group-hover:text-blue-600 transition-colors mb-3">
            {post.header}
          </h3>
          <p
            className={`text-sm text-gray-500 leading-relaxed transition-all duration-300 ${open ? "" : "line-clamp-3"}`}
          >
            {post.content}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <time className="text-xs text-gray-400 font-medium">
            {formatDateFull(post.date)}
          </time>
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-500">
            {open ? (
              <>
                <ChevronUp className="size-3.5" />
                Lukk
              </>
            ) : (
              <>
                <ChevronDown className="size-3.5" />
                Les mer
              </>
            )}
          </span>
        </div>
      </div>
      <div className="h-44 sm:h-auto overflow-hidden order-1 sm:order-2">
        <img
          src={img}
          alt={post.header}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </button>
  );
}

/** Secondary story — left colour bar + text + square thumbnail */
function SecondaryStory({
  post,
  img,
  accent,
}: {
  post: NewsFeedDTO;
  img: string;
  accent: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <button
      type="button"
      className={`group flex items-stretch gap-0 w-full text-left rounded-xl overflow-hidden bg-white border-l-4 ${accent} hover:shadow-sm transition-all cursor-pointer`}
      onClick={() => setOpen((o) => !o)}
    >
      <div className="flex-1 min-w-0 px-4 py-3 flex flex-col justify-between gap-2">
        <div>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`${tagBg(tag)} text-white text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
          <h3 className="text-sm font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.header}
          </h3>
          <p
            className={`text-xs text-gray-400 leading-relaxed mt-1 transition-all duration-300 ${open ? "" : "line-clamp-2"}`}
          >
            {post.content}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <time className="text-[10px] text-gray-300">
            {formatDateFull(post.date)}
          </time>
          <span className="flex items-center gap-0.5 text-[10px] font-semibold text-blue-400">
            {open ? (
              <>
                <ChevronUp className="size-3" />
                Lukk
              </>
            ) : (
              <>
                <ChevronDown className="size-3" />
                Les mer
              </>
            )}
          </span>
        </div>
      </div>
      <div
        className={`shrink-0 self-center mr-3 rounded-lg overflow-hidden transition-all duration-300 ${open ? "w-0 opacity-0" : "w-20 h-20 opacity-100"}`}
      >
        <img
          src={img}
          alt={post.header}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
    </button>
  );
}

export default function NewsFeed() {
  const { data: newsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);

  if (!newsfeeds || newsfeeds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Newspaper className="size-10 text-gray-200" />
        <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
      </div>
    );
  }

  const [first, ...rest] = newsfeeds;

  return (
    <div className="flex flex-col gap-3">
      {first && <LeadStory post={first} img={NEWS_IMAGES[0] ?? ""} />}
      {rest.map((post, idx) => (
        <SecondaryStory
          key={post.uuid}
          post={post}
          img={NEWS_IMAGES[(idx + 1) % NEWS_IMAGES.length] ?? ""}
          accent={
            BORDER_ACCENTS[idx % BORDER_ACCENTS.length] ?? "border-blue-500"
          }
        />
      ))}
    </div>
  );
}
