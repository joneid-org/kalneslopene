import {useQuery} from "@tanstack/react-query";
import DOMPurify from "dompurify";
import {ArrowLeft, ExternalLink, Images} from "lucide-react";
import {useEffect, useMemo, useRef, useState} from "react";
import {Link, useParams} from "react-router";
import {QUERIES} from "@/api/queries.ts";
import PhotoDialog from "@/components/PhotoDialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import type {StaticS3File} from "@/data/loypekartData.ts";
import {NEWS_IMAGES, tagColor, useTags} from "@/lib/newsUtils.ts";
import {formatDateFull} from "@/lib/timeUtils.ts";

export function NewsArticle() {
  const { uuid } = useParams<{ uuid: string }>();
  const [contentPhotos, setContentPhotos] = useState<StaticS3File[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const postQuery = useQuery(QUERIES.newsfeed.getNewsFeedByUuid(uuid ?? ""));
  const post = postQuery.data;
  const tags = useTags();

  // Stable object identity: React re-assigns innerHTML whenever this prop is a
  // new reference, which would wipe the attributes set in the effect below.
  const sanitizedContent = useMemo(
    () => ({ __html: DOMPurify.sanitize(post?.content ?? "") }),
    [post?.content],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: sanitizedContent is not read here, but its identity changing is what makes React re-assign innerHTML and replace the images below
  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const images = [...container.querySelectorAll("img")];
    for (const img of images) {
      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", "Vis bilde i full størrelse");
    }
    setContentPhotos(
      images.map((img) => ({
        url: img.currentSrc || img.src,
        description: img.alt,
      })),
    );
  }, [sanitizedContent]);

  const openContentImage = (target: EventTarget) => {
    const container = contentRef.current;
    if (!container || !(target instanceof HTMLImageElement)) return false;
    const index = [...container.querySelectorAll("img")].indexOf(target);
    if (index < 0) return false;
    setLightboxIndex(index);
    return true;
  };

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

  const photos: StaticS3File[] = headerImage
    ? [...contentPhotos, { url: headerImage, description: post.header }]
    : contentPhotos;

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
          <div className="flex flex-wrap gap-2">
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
            {post.connectedRace?.uuid && (
              <Link to={`/bilder/${post.connectedRace.uuid}`}>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-primary border-border hover:bg-primary/10 shrink-0"
                >
                  <Images className="size-3.5" />
                  Se bilder
                </Button>
              </Link>
            )}
          </div>
        </div>

        <h2 className="mb-1">{post.header}</h2>
        <time className="text-xs font-medium block lowercase mb-4">
          {formatDateFull(post.date)}
        </time>

        <Separator className="mb-3" />

        {/** biome-ignore lint/a11y/noStaticElementInteractions: handlers delegate to the images inside, which get role="button" and tabIndex in the effect above */}
        <div
          ref={contentRef}
          className="text-sm leading-relaxed mb-6 prose prose-sm max-w-none break-words [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:max-h-[80dvh] [&_img]:object-contain [&_img]:rounded-lg [&_img]:my-2 [&_img]:cursor-zoom-in [&_img]:hover:opacity-90 [&_img]:transition [&_a]:text-blue-600 [&_a]:underline"
          onClick={(event) => openContentImage(event.target)}
          onKeyDown={(event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            if (openContentImage(event.target)) event.preventDefault();
          }}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: rich text HTML from admin editor, sanitized with DOMPurify above
          dangerouslySetInnerHTML={sanitizedContent}
        />

        {headerImage && (
          <button
            type="button"
            className="block w-full focus:outline-none"
            aria-label="Vis bilde i full størrelse"
            onClick={() => setLightboxIndex(contentPhotos.length)}
          >
            <img
              src={headerImage}
              alt={post.header}
              className="max-w-full w-auto h-auto max-h-[80dvh] mx-auto rounded-lg block cursor-zoom-in hover:opacity-90 transition object-contain"
            />
          </button>
        )}

        <PhotoDialog
          photos={photos}
          index={lightboxIndex}
          onIndexChange={setLightboxIndex}
        />
      </div>
    </div>
  );
}
