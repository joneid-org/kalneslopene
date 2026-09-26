import {
  CheckCircle2Icon,
  CircleDashedIcon,
  NewspaperIcon,
} from "lucide-react";
import { Link } from "react-router";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { RowActions } from "@/components/admin/RowActions.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import { tagColor, useTags } from "@/lib/newsUtils.ts";
import { formatDateFull } from "@/lib/timeUtils.ts";
import type { NewsFeedDTO } from "@/model/DTO.ts";

export function NewsfeedsCard({
  newsfeeds,
  onEdit,
  onDelete,
}: {
  newsfeeds: NewsFeedDTO[];
  onEdit: (newsfeed: NewsFeedDTO) => void;
  onDelete: (newsfeed: NewsFeedDTO) => void;
}) {
  const tags = useTags();
  return (
    <AdminCard
      icon={<NewspaperIcon className="size-4 text-primary" />}
      title="Alle nyheter"
      items={newsfeeds}
      columns={[
        { label: "Dato" },
        { label: "Overskrift" },
        { label: "Tagger", className: "hidden sm:table-cell" },
        { label: "", className: "w-20" },
      ]}
      emptyText="Ingen nyheter registrert."
      renderRow={(feed) => (
        <>
          <TableCell className="text-muted-foreground tabular-nums whitespace-nowrap">
            <span className="inline-flex items-center gap-2">
              {feed.isPublished ? (
                <CheckCircle2Icon
                  className="size-3.5 shrink-0 text-green-600"
                  aria-label="Publisert"
                />
              ) : (
                <CircleDashedIcon
                  className="size-3.5 shrink-0 text-red-600"
                  aria-label="Utkast"
                />
              )}
              {formatDateFull(feed.date)}
            </span>
          </TableCell>
          <TableCell className="font-medium">
            <Link to={`/nyheter/${feed.uuid}`} className="hover:underline">
              {feed.header}
            </Link>
            {!feed.isPublished && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                Utkast
              </span>
            )}
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <div className="flex flex-wrap gap-1">
              {feed.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag-pill"
                  style={{ color: tagColor(tag, tags) }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </TableCell>
          <RowActions
            onEdit={() => onEdit(feed)}
            onDelete={() => onDelete(feed)}
          />
        </>
      )}
    />
  );
}
