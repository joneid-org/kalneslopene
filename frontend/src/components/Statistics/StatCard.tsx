import type { ReactNode } from "react";
import { cn } from "@/lib/utils.ts";

type Props = {
  title: string;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function StatCard({
  title,
  subtitle,
  action,
  className,
  children,
}: Props) {
  return (
    <div className={cn("rounded-2xl border bg-card p-4 md:p-5", className)}>
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-base font-extrabold tracking-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}
