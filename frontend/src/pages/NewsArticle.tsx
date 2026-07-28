import { useQuery } from "@tanstack/react-query";
import DOMPurify from "dompurify";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator.tsx";
import { NEWS_IMAGES, tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";

type Lightbox = { src: string; alt: string };

export function NewsArticle() {
  const { uuid } = useParams<{ uuid: string }>();
  const [lightbox, setLightbox] = useState<Lightbox | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const postQuery = useQuery(QUERIES.newsfeed.getNewsFeedByUuid(uuid ?? ""));
  const post = postQuery.data;
  const tags = useTags();

  // Stable object identity: React re-assigns innerHTML whenever this prop is a
  // new reference, which would wipe the listeners and attributes set below.
  const sanitizedContent = useMemo(
    () => ({ __html: DOMPurify.sanitize(post?.content ?? "") }),
    [post?.content],
  );

  useEffect(() => {
    const container = contentRef.current;
    if (!container || !post?.content) return;

    for (const img of container.querySelectorAll("img")) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Vis bilde i full størrelse");
    }

    const imageFrom = (target: EventTarget | null) =>
      target instanceof HTMLImageElement ? target : null;
    const show = (img: HTMLImageElement) =>
      setLightbox({ src: img.currentSrc || img.src, alt: img.alt });

    const onClick = (event: MouseEvent) => {
      const img = imageFrom(event.target);
      if (img) show(img);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      const img = imageFrom(event.target);
      if (!img || (event.key !== "Enter" && event.key !== " ")) return;
      event.preventDefault();
      show(img);
    };

    container.addEventListener("click", onClick);
    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("click", onClick);
      container.removeEventListener("keydown", onKeyDown);
    };
  }, [post?.content]);

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
          ref={contentRef}
          className="text-sm leading-relaxed mb-6 prose prose-sm max-w-none break-words [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-h-[80dvh] [&_img]:object-contain [&_img]:rounded-lg [&_img]:my-2 [&_img]:cursor-zoom-in [&_img]:hover:opacity-90 [&_img]:transition [&_a]:text-blue-600 [&_a]:underline"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text HTML from admin editor, sanitized with DOMPurify above
          dangerouslySetInnerHTML={sanitizedContent}
        />

        {headerImage && (
          <button
            type="button"
            className="block w-full focus:outline-none"
            aria-label="Vis bilde i full størrelse"
            onClick={() =>
              setLightbox({ src: headerImage, alt: post.header ?? "" })
            }
          >
            <img
              src={headerImage}
              alt={post.header}
              className="max-w-full w-auto h-auto max-h-[80dvh] mx-auto rounded-lg block cursor-zoom-in hover:opacity-90 transition object-contain"
            />
          </button>
        )}

        <Dialog
          open={lightbox !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen) setLightbox(null);
          }}
        >
          <DialogContent className="w-fit max-w-[calc(100vw-1rem)] max-h-[calc(100dvh-1rem)] sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100dvh-2rem)] p-2 sm:p-4 bg-white border-0">
            <DialogTitle className="sr-only">
              {lightbox?.alt || post.header}
            </DialogTitle>
            {lightbox && (
              <img
                src={lightbox.src}
                alt={lightbox.alt}
                className="block h-auto w-auto max-h-[calc(100dvh-3rem)] max-w-[calc(100vw-2rem)] max-h-[calc(100dvh-2rem)] object-contain rounded-md object-contain sm:max-h-[calc(100dvh-5rem)] sm:max-w-[calc(100vw-4rem)] sm:max-h-[calc(100dvh-4rem)]"
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
