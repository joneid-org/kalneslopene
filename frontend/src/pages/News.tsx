import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { NewsCard } from "@/components/News/NewsCard.tsx";
import { Pagination } from "@/components/Pagination.tsx";
import { Button } from "@/components/ui/button.tsx";
import { NEWS_IMAGES } from "@/lib/newsUtils.ts";

const PAGE_SIZE = 9;

export function News() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, Number(searchParams.get("side")) || 1);
  const { data } = useQuery(QUERIES.newsfeed.getNewsFeed(page - 1, PAGE_SIZE));

  const visible = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = Math.max(1, data?.totalPages ?? 1);

  const start = (page - 1) * PAGE_SIZE;

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4">
            {visible.map((post, idx) => (
              <NewsCard
                key={post.uuid}
                post={post}
                img={NEWS_IMAGES[(start + idx) % NEWS_IMAGES.length] ?? ""}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={goToPage}
          />
        </div>
      )}
    </div>
  );
}
