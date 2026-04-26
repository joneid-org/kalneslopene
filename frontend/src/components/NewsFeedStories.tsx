/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */

import { useQuery } from "@tanstack/react-query";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO, NewsfeedTagDTO, RaceDTO } from "@/model/DTO.ts";

/** Static fallback used before API tags are loaded */
export const PREDEFINED_TAGS: NewsfeedTagDTO[] = [
  { label: "Resultater", value: "resultater", color: "bg-blue-600" },
  { label: "Bilder", value: "bilder", color: "bg-purple-600" },
  { label: "Kommende løp", value: "kommende løp", color: "bg-green-600" },
  { label: "Ukens løp", value: "ukens løp", color: "bg-orange-500" },
];

export const TAG_BG: Record<string, string> = Object.fromEntries(
  PREDEFINED_TAGS.map((t) => [t.value, t.color]),
);

export function tagBg(tag: string, tags?: NewsfeedTagDTO[]) {
  const list = tags ?? PREDEFINED_TAGS;
  return (
    list.find((t) => t.value.toLowerCase() === tag.toLowerCase())?.color ??
    "bg-black"
  );
}

/** Hook to get live tags from backend, falling back to PREDEFINED_TAGS */
export function useTags(): NewsfeedTagDTO[] {
  const { data } = useQuery(QUERIES.newsfeed.getAllTags);
  return data && data.length > 0 ? data : PREDEFINED_TAGS;
}

export const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?w=600&q=75",
  "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?w=600&q=75",
  "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?w=600&q=75",
  "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?w=600&q=75",
  "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?w=600&q=75",
];

function sameDate(a: unknown, b: Date): boolean {
  const aStr = String(a).slice(0, 10);
  const bStr = `${b.getFullYear()}-${String(b.getMonth() + 1).padStart(2, "0")}-${String(b.getDate()).padStart(2, "0")}`;
  return aStr === bStr;
}

function findRaceForPost(
  races: RaceDTO[],
  post: NewsFeedDTO,
): RaceDTO | undefined {
  const hasResultTag = post.tags.some((t) =>
    ["resultat", "resultater"].includes(t.toLowerCase()),
  );
  if (!hasResultTag) return undefined;
  return races.find((r) => sameDate(r.raceDate, post.date));
}

export function StoryDialog({
  post,
  img,
  open,
  onClose,
}: {
  post: NewsFeedDTO;
  img: string;
  open: boolean;
  onClose: () => void;
}) {
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const tags = useTags();
  const matchedRace = findRaceForPost(races ?? [], post);
  const heroImg = post.headerImage ?? img;
  const galleryImages = post.images ?? [];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="p-0 overflow-hidden max-h-[90vh] flex flex-col w-[95vw] sm:w-[75vw] max-w-none [&>button]:top-3 [&>button]:right-3 [&>button]:bg-black [&>button]:text-white [&>button]:rounded-lg [&>button]:size-10 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:hover:bg-gray-800 [&>button]:opacity-100">
        <div className="aspect-video shrink-0 overflow-hidden">
          <img
            src={heroImg}
            alt={post.header}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-6 pb-6 pt-4 overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <Link key={tag} to={`/nyheter/tag/${tag.toLowerCase()}`}>
                    <span
                      className={`${tagBg(tag, tags)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer`}
                    >
                      {tag}
                    </span>
                  </Link>
                ))}
              </div>
              {matchedRace?.uuid && (
                <Link to={`/Resultater/${matchedRace.uuid}`} onClick={onClose}>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-blue-600 border-blue-200 hover:bg-blue-50 shrink-0"
                  >
                    <ExternalLink className="size-3.5" />
                    Se resultater
                  </Button>
                </Link>
              )}
            </div>
            <DialogTitle className="text-2xl font-black text-gray-900 leading-tight text-left">
              {post.header}
            </DialogTitle>
            <time className="text-xs text-gray-400 font-medium">
              {formatDateFull(post.date)}
            </time>
          </DialogHeader>
          <Separator className="my-4" />
          <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
            {post.content}
          </p>
          {galleryImages.length > 0 && (
            <>
              <Separator className="my-4" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {galleryImages.map((src, idx) => (
                  <div
                    key={idx}
                    className="rounded-md overflow-hidden border aspect-video"
                  >
                    <img
                      src={src}
                      alt={`Bilde ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function FeaturedStory({
  post,
  img,
}: {
  post: NewsFeedDTO;
  img: string;
}) {
  const [open, setOpen] = useState(false);
  const displayImg = post.headerImage ?? img;
  const tags = useTags();

  return (
    <>
      <Card className="overflow-hidden group border-blue-100 hover:shadow-lg transition-all">
        <div className="grid sm:grid-cols-[1fr_260px]">
          <div className="order-2 sm:order-1">
            <CardHeader className="pb-2 pt-5 sm:pt-6">
              <div className="flex flex-wrap gap-1.5 mb-1">
                {post.tags.map((tag) => (
                  <Link key={tag} to={`/nyheter/tag/${tag.toLowerCase()}`}>
                    <span
                      className={`${tagBg(tag, tags)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer`}
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
                {formatDateFull(post.date)}
              </time>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 font-semibold"
                onClick={() => setOpen(true)}
              >
                Les mer
              </Button>
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
      <StoryDialog
        post={post}
        img={img}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function CompactStory({
  post,
  img,
}: {
  post: NewsFeedDTO;
  img: string;
}) {
  const displayImg = post.headerImage ?? img;
  const tags = useTags();

  return (
    <Link to={`/nyheter/${post.uuid}`} className="block group">
      <Card className="overflow-hidden hover:shadow-md transition-all h-full flex flex-col gap-0 py-0">
        <div className="aspect-video overflow-hidden shrink-0">
          <img
            src={displayImg}
            alt={post.header}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardHeader className="px-2 pt-2 pb-1 flex-1 gap-1">
          <p className="text-md font-bold text-black group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {post.header}
          </p>
          <p className="text-xs text-black leading-snug line-clamp-2">
            {post.content}
          </p>
        </CardHeader>
        <CardFooter className="px-2 pb-3 pt-1 mb-1 flex flex-wrap items-center justify-between gap-1">
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                to={`/nyheter/tag/${tag.toLowerCase()}`}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge
                  className={`${tagBg(tag, tags)} text-white text-[11px] border-0 px-1.5 py-0 hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <time className="text-[10px] text-black">
            {formatDateFull(post.date)}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}

/** Super compact vertical list item for mobile */
export function CompactListStory({
  post,
  img,
}: {
  post: NewsFeedDTO;
  img: string;
}) {
  const [open, setOpen] = useState(false);
  const displayImg = post.headerImage ?? img;
  const tags = useTags();

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-3 w-full text-left py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="size-10 shrink-0 rounded-md overflow-hidden">
          <img
            src={displayImg}
            alt={post.header}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-0.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`${tagBg(tag, tags)} text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full`}
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-900 leading-snug line-clamp-2">
            {post.header}
          </p>
          <time className="text-[10px] text-gray-400">
            {formatDateFull(post.date)}
          </time>
        </div>
      </button>
      <StoryDialog
        post={post}
        img={img}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
