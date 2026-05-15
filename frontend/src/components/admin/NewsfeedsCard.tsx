import { NewspaperIcon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { RowActions } from "@/components/admin/RowActions.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { TableCell } from "@/components/ui/table.tsx";
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
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
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
