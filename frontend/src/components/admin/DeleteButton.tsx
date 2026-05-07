import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

type Props = {
  onClick: (e?: React.MouseEvent) => void;
  size?: "sm" | "default";
  stopPropagation?: boolean;
};

export function DeleteButton({
  onClick,
  size = "sm",
  stopPropagation = false,
}: Props) {
  return (
    <Button
      size={size}
      variant="ghost"
      className={`${size === "sm" ? "h-7 w-7" : ""} p-0 text-destructive hover:text-destructive`}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        onClick(e);
      }}
    >
      <Trash2Icon className="size-3.5" />
    </Button>
  );
}
