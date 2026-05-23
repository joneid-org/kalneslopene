import { Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";

export function ConfirmDeleteDialog({
  title,
  description,
  isPending,
  onConfirm,
  onClose,
}: {
  title: string;
  description: ReactNode;
  isPending: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{description}</p>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <Button variant="destructive" disabled={isPending} onClick={onConfirm}>
          <Trash2Icon className="size-4" />
          Slett
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
