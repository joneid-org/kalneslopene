import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ChevronLeft, ChevronRight, Newspaper } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { TagNewsFeed } from "@/components/News/TagNewsFeed.tsx";
import { Button } from "@/components/ui/button.tsx";
import { NEWS_IMAGES } from "@/lib/newsUtils.ts";

const PAGE_SIZE = 6;

function pageItems(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items: (number | "...")[] = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);
  if (left > 2) items.push("...");
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push("...");
  items.push(total);
  return items;
}

export function News() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("side")) || 1);
  const { data } = useQuery(
    QUERIES.newsfeed.getNewsArchivePage(page - 1, PAGE_SIZE),
  );

  const visible = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const start = (page - 1) * PAGE_SIZE;
  const items = pageItems(page, totalPages);

  const goToPage = (next: number) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next <= 1) params.delete("side");
        else params.set("side", String(next));
        return params;
      },
      { preventScrollReset: true },
    );
    window.scrollTo({ top: 0 });
  };

  return (
    <div className="page-content-sm">
      <Link to="/" className="inline-block mb-3">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="size-4" />
          Tilbake
        </Button>
      </Link>
      <div className="mb-6">
        <h1 className="page-title">Nyheter</h1>
        <p className="page-subtitle mt-1">{totalElements} nyheter</p>
      </div>

      {totalElements === 0 ? (
        <div className="empty-state">
          <Newspaper className="size-10 text-gray-200" />
          <p className="text-sm text-gray-400">Ingen nyheter ennå.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {visible.map((post, idx) => (
            <TagNewsFeed
              key={post.uuid}
              post={post}
              img={NEWS_IMAGES[(start + idx) % NEWS_IMAGES.length] ?? ""}
            />
          ))}

          {totalPages > 1 && (
            <nav
              className="flex items-center justify-center gap-1.5 pt-2"
              aria-label="Paginering"
            >
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => goToPage(page - 1)}
                disabled={page === 1}
                aria-label="Forrige side"
              >
                <ChevronLeft className="size-4" />
              </Button>
              {items.map((item, idx) =>
                item === "..." ? (
                  <span
                    key={`ellipsis-${items[idx - 1]}`}
                    className="px-1.5 text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === page ? "default" : "outline"}
                    size="icon-sm"
                    onClick={() => goToPage(item)}
                    aria-current={item === page ? "page" : undefined}
                  >
                    {item}
                  </Button>
                ),
              )}
              <Button
                variant="outline"
                size="icon-sm"
                onClick={() => goToPage(page + 1)}
                disabled={page === totalPages}
                aria-label="Neste side"
              >
                <ChevronRight className="size-4" />
              </Button>
            </nav>
          )}
        </div>
      )}
    </div>
  );
}
