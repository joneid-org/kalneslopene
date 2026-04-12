import { useState } from "react";
import { Link } from "react-router";
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
import type { NewsFeedDTO } from "@/model/DTO.ts";

export const TAG_BG: Record<string, string> = {
  resultat: "bg-blue-600",
  resultater: "bg-blue-600",
  info: "bg-orange-500",
  jubileum: "bg-purple-500",
  arrangement: "bg-pink-500",
};
export function tagBg(tag: string) {
  return TAG_BG[tag.toLowerCase()] ?? "bg-black";
}

export const NEWS_IMAGES = [
  "https://images.unsplash.com/photo-1692170226404-969b6e5cde95?w=600&q=75",
  "https://images.unsplash.com/photo-1657460684508-7c8fa5ba748b?w=600&q=75",
  "https://images.unsplash.com/photo-1731991027003-386ac5ae9c72?w=600&q=75",
  "https://images.unsplash.com/photo-1769867628770-10a544d2a02c?w=600&q=75",
  "https://images.unsplash.com/photo-1766970096331-78c8af007a3b?w=600&q=75",
];

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
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent
        className="p-0 overflow-hidden max-h-[90vh] flex flex-col [&>button]:top-3 [&>button]:right-3 [&>button]:bg-black [&>button]:text-white [&>button]:rounded-lg [&>button]:size-10 [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:hover:bg-gray-800 [&>button]:opacity-100"
        style={{ width: "min(50vw, 100%)", maxWidth: "none" }}
      >
        <div className="h-56 shrink-0 overflow-hidden">
          <img
            src={img}
            alt={post.header}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="px-6 pb-6 pt-4 overflow-y-auto">
          <DialogHeader>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {post.tags.map((tag) => (
                <Link key={tag} to={`/nyheter/tag/${tag.toLowerCase()}`}>
                  <span
                    className={`${tagBg(tag)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer`}
                  >
                    {tag}
                  </span>
                </Link>
              ))}
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
                      className={`${tagBg(tag)} text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity cursor-pointer`}
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
              src={img}
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card className="shrink-0 w-56 overflow-hidden group hover:shadow-md transition-all">
        <div className="h-28 overflow-hidden">
          <img
            src={img}
            alt={post.header}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-3">
          <div className="flex flex-wrap gap-1 mb-1.5">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/nyheter/tag/${tag.toLowerCase()}`}>
                <Badge
                  className={`${tagBg(tag)} text-white text-[9px] border-0 px-1.5 py-0 hover:opacity-80 transition-opacity cursor-pointer`}
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <button
            type="button"
            className="text-xs font-bold text-gray-900 hover:text-blue-600 transition-colors leading-snug line-clamp-2 text-left w-full cursor-pointer"
            onClick={() => setOpen(true)}
          >
            {post.header}
          </button>
          <time className="text-[10px] text-gray-300 mt-1 block">
            {formatDateFull(post.date)}
          </time>
        </CardContent>
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

/** Super compact vertical list item for mobile */
export function CompactListStory({
  post,
  img,
}: {
  post: NewsFeedDTO;
  img: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="flex items-center gap-3 w-full text-left py-2.5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
        onClick={() => setOpen(true)}
      >
        <div className="size-10 shrink-0 rounded-md overflow-hidden">
          <img
            src={img}
            alt={post.header}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-1 mb-0.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className={`${tagBg(tag)} text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0 rounded-full`}
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
