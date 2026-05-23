import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";

export type AdminCardColumn = {
  label: string;
  className?: string;
};

export function AdminCard<T>({
  icon,
  title,
  items,
  columns,
  emptyText,
  headerExtra,
  renderRow,
  cardClassName,
}: {
  icon: ReactNode;
  title: string;
  items: T[];
  columns: AdminCardColumn[];
  emptyText: string;
  headerExtra?: ReactNode;
  renderRow: (item: T) => ReactNode;
  cardClassName?: string;
}) {
  return (
    <Card className={cardClassName}>
      <CardHeader className="pb-2 space-y-2">
        <CardTitle className="text-base flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary">{items.length}</Badge>
        </CardTitle>
        {headerExtra}
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                <TableHead key={i} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center text-muted-foreground py-6 text-sm italic"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            )}
            {items.map((item, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: no stable key available generically
              <TableRow key={i}>{renderRow(item)}</TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
