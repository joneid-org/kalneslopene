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
import {
  findRaceForPost,
  NEWS_IMAGES,
  tagColor,
  useTags,
} from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";

export function NewsArticle() {
  const { uuid } = useParams<{ uuid: string }>();
  const [open, setOpen] = useState(false);
  const { data: post } = useQuery(
    QUERIES.newsfeed.getNewsFeedByUuid(uuid ?? ""),
  );
  const { data: races } = useQuery(QUERIES.race.getAllRaces());
  const tags = useTags();

  if (!post) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-gray-400">Laster artikkel...</p>
      </div>
    );
  }

  const imgIndex = [...post.uuid].reduce((sum, c) => sum + c.charCodeAt(0), 0);
  const fallbackImg = NEWS_IMAGES[imgIndex % NEWS_IMAGES.length] ?? "";
  const headerImage = post.headerImage?.url ?? fallbackImg;
  const matchedRace = findRaceForPost(races ?? [], post);

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
              <Link key={tag} to={`/nyheter/tag/${tag.toLowerCase()}`}>
                <span
                  className="tag-pill"
                  style={{ color: tagColor(tag, tags) }}
                >
                  {tag}
                </span>
              </Link>
            ))}
          </div>
          {matchedRace?.uuid && (
            <Link to={`/Resultater/${matchedRace.uuid}`}>
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

        <p
          className="text-sm leading-relaxed mb-6 prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2 [&_a]:text-blue-600 [&_a]:underline"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text HTML from admin editor, sanitized with DOMPurify below
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
        />

        {headerImage && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <button
                type="button"
                className="focus:outline-none"
                aria-label="Vis bilde i full størrelse"
              >
                <img
                  src={headerImage}
                  alt={post.header}
                  className="w-full h-auto rounded-lg block cursor-zoom-in hover:opacity-90 transition object-contain"
                  style={{ maxWidth: "var(--page-max-width)", width: "auto" }}
                />
              </button>
            </DialogTrigger>
            <DialogContent
              className="p-2 sm:p-4 bg-white border-0"
              style={{ maxWidth: "var(--page-max-width)", width: "95vw" }}
            >
              <DialogTitle className="sr-only">{post.header}</DialogTitle>
              <img
                src={headerImage}
                alt={post.header}
                className="w-full rounded-md object-contain max-h-[88vh]"
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
