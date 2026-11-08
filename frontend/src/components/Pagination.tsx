import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

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

export function Pagination({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const items = pageItems(page, totalPages);

  return (
    <nav
      className="flex items-center justify-center gap-1.5 pt-2"
      aria-label="Paginering"
    >
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page - 1)}
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
            onClick={() => onPageChange(item)}
            aria-current={item === page ? "page" : undefined}
          >
            {item}
          </Button>
        ),
      )}
      <Button
        variant="outline"
        size="icon-sm"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Neste side"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  );
}
