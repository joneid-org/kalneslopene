import { Loader2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button.tsx";

export function LoadingButton({
  loading,
  disabled,
  icon,
  children,
  ...props
}: ComponentProps<typeof Button> & { loading?: boolean; icon?: ReactNode }) {
  return (
    <Button disabled={disabled || loading} {...props}>
      {loading ? <Loader2Icon className="size-4 animate-spin" /> : icon}
      {children}
    </Button>
  );
}
