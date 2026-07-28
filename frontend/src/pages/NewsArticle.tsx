import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator.tsx";
import { NEWS_IMAGES, tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";

export function NewsArticle() {
  const { uuid } = useParams<{ uuid: string }>();
  const [open, setOpen] = useState(false);
  const postQuery = useQuery(QUERIES.newsfeed.getNewsFeedByUuid(uuid ?? ""));
  const post = postQuery.data;
  const tags = useTags();

  if (!post) {
    if (postQuery.isPending) {
      return (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-gray-400">Laster artikkel...</p>
        </div>
      );
    }
    throw new Response("Fant ikke artikkelen", { status: 404 });
  }

  const imgIndex = [...post.uuid].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const fallbackImg = NEWS_IMAGES[imgIndex % NEWS_IMAGES.length] ?? "";
  const headerImage = post.headerImage?.url ?? fallbackImg;

  return (
    <div className="w-full px-4 py-6">
      <div
        className="mx-auto w-full"
        style={{ maxWidth: "var(--page-max-width)" }}
      >
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2 mb-4">
            <ArrowLeft className="size-4" />
            Tilbake
          </Button>
        </Link>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex flex-wrap gap-1.5 text-xs">
            {post.tags.map((tag) => (
              <Link key={tag} to={`/nyheter/tagg/${tag.toLowerCase()}`}>
                <span
                  className="tag-pill"
                  style={{ color: tagColor(tag, tags) }}
                >
                  {tag}
                </span>
              </Link>
            ))}
          </div>
          {post.connectedRace?.uuid && (
            <Link to={`/resultater/${post.connectedRace.uuid}`}>
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 text-primary border-border hover:bg-primary/10 shrink-0"
              >
                <ExternalLink className="size-3.5" />
                Se resultater
              </Button>
            </Link>
          )}
        </div>

        <h2 className="mb-1">{post.header}</h2>
        <time className="text-xs font-medium block lowercase mb-4">
          {formatDateFull(post.date)}
        </time>

        <Separator className="mb-3" />

        <div
          className="text-sm leading-relaxed mb-6 prose prose-sm max-w-none break-words [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-lg [&_img]:my-2 [&_a]:text-blue-600 [&_a]:underline"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text HTML from admin editor, sanitized with DOMPurify below
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {headerImage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="block w-full focus:outline-none"
                aria-label="Vis bilde i full størrelse"
              >
                <img
                  src={headerImage}
                  alt={post.header}
                  className="max-w-full h-auto mx-auto rounded-lg block cursor-zoom-in hover:opacity-90 transition object-contain"
                />
              </button>
            </DialogTrigger>
            <DialogContent className="w-fit max-w-[calc(100vw-1rem)] sm:max-w-[calc(100vw-2rem)] p-2 sm:p-4 bg-white border-0">
              <DialogTitle className="sr-only">{post.header}</DialogTitle>
              <img
                src={headerImage}
                alt={post.header}
                className="block h-auto w-auto max-h-[calc(100dvh-3rem)] max-w-[calc(100vw-2rem)] rounded-md object-contain sm:max-h-[calc(100dvh-5rem)] sm:max-w-[calc(100vw-4rem)]"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
