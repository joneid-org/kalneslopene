import { PencilIcon } from "lucide-react";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { Button } from "@/components/ui/button.tsx";
import { TableCell } from "@/components/ui/table.tsx";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export function RowActions({ onEdit, onDelete }: Props) {
  return (
    <TableCell>
      <div className="flex items-center gap-1 justify-end">
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={onEdit}
        >
          <PencilIcon className="size-3.5" />
        </Button>
        <DeleteButton onClick={onDelete} />
      </div>
    </TableCell>
  );
}
