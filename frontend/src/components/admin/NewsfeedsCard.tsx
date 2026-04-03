import { NewspaperIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { AdminCard } from "@/components/admin/AdminCard.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
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
          <TableCell>
            <div className="flex items-center gap-1 justify-end">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0"
                onClick={() => onEdit(feed)}
              >
                <PencilIcon className="size-3.5" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(feed)}
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            </div>
          </TableCell>
        </>
      )}
    />
  );
}
