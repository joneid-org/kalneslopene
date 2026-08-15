import { Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";
import { LoadingButton } from "@/components/LoadingButton.tsx";
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
  disableConfirm,
  confirmLabel = "Slett",
  confirmIcon = <Trash2Icon className="size-4" />,
  children,
  onConfirm,
  onClose,
}: {
  title: string;
  description: ReactNode;
  isPending: boolean;
  disableConfirm?: boolean;
  confirmLabel?: string;
  confirmIcon?: ReactNode;
  children?: ReactNode;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <p className="text-sm text-muted-foreground">{description}</p>
      {children}
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <LoadingButton
          variant="destructive"
          loading={isPending}
          disabled={disableConfirm}
          icon={confirmIcon}
          onClick={onConfirm}
        >
          {confirmLabel}
        </LoadingButton>
      </DialogFooter>
    </DialogContent>
  );
}
