import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { NEWS_IMAGES, tagBg, useTags } from "@/components/NewsFeedStories.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatDateFull } from "@/lib/timeUtils.ts";

function sameDate(a: unknown, b: Date): boolean {
  const aStr = String(a).slice(0, 10);
  const bStr = `${b.getFullYear()}-${String(b.getMonth() + 1).padStart(2, "0")}-${String(b.getDate()).padStart(2, "0")}`;
  return aStr === bStr;
}

export function NyhetArtikel() {
  const { uuid } = useParams<{ uuid: string }>();
  const { data: post } = useQuery(
    QUERIES.newsfeed.getNewsFeedByUuid(uuid ?? ""),
  );
  const { data: races } = useQuery(QUERIES.race.getAllRaces);
  const { data: allNewsfeeds } = useQuery(QUERIES.newsfeed.getAllNewsFeeds);
  const tags = useTags();

  if (!post) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-sm text-gray-400">Laster artikkel...</p>
      </div>
    );
  }

  const fallbackImg =
    NEWS_IMAGES[
      (allNewsfeeds?.findIndex((n) => n.uuid === uuid) ?? 0) %
        NEWS_IMAGES.length
    ] ?? "";
  const heroImg = post.headerImage ?? fallbackImg;

  const matchedRace = (() => {
    const hasResultTag = post.tags.some((t) =>
      ["resultat", "resultater"].includes(t.toLowerCase()),
    );
    if (!hasResultTag || !races) return undefined;
    return races.find((r) => sameDate(r.raceDate, post.date));
  })();

  return (
    <div className="w-full px-4 py-6">
      {/* Back button — always 80vw centered */}
      <div className="mb-4 max-w-[80vw] mx-auto">
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-1 -ml-2">
            <ArrowLeft className="size-4" />
            Tilbake
          </Button>
        </Link>
      </div>

      {/* Main content — shrinks to image natural width, max 80vw, centered */}
      <div className="mx-auto w-fit max-w-[80vw]">
        {/* Tags + result link */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
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
            <Link to={`/Resultater/${matchedRace.uuid}`}>
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

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">
          {post.header}
        </h1>
        <time className="text-xs text-gray-400 font-medium block mb-4">
          {formatDateFull(post.date)}
        </time>

        <Separator className="mb-6" />

        {/* Content */}
        <p className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line mb-6">
          {post.content}
        </p>

        {/* Hero image — natural width, capped at 80vw */}
        {heroImg && (
          <img
            src={heroImg}
            alt={post.header}
            className="h-auto rounded-lg block"
            style={{ maxWidth: "80vw", width: "auto" }}
          />
        )}
      </div>
    </div>
  );
}
