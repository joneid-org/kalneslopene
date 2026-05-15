import { Button } from "@/components/ui/button.tsx";
import { DialogFooter } from "@/components/ui/dialog.tsx";

export function FormFooter({
  submitLabel,
  disabled,
  onCancel,
  onSubmit,
}: {
  submitLabel: string;
  disabled?: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}) {
  return (
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Avbryt
      </Button>
      <Button disabled={disabled} onClick={onSubmit}>
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}
