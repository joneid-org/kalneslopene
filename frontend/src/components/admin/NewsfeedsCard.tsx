import { NewspaperIcon } from "lucide-react";
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
            {formatDateFull(feed.date)}
          </TableCell>
          <TableCell className="font-medium">{feed.header}</TableCell>
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
