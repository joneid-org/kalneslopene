import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";

type StatBoxProps = {
  icon: LucideIcon;
  value: string | number | undefined;
  label: string;
  compact?: boolean;
};

export default function StatBox({
  icon: Icon,
  value,
  label,
  compact,
}: StatBoxProps) {
  return (
    <Card>
      <CardContent
        className={`flex items-center gap-1.5 justify-center${
          compact ? " py-1 px-2" : ""
        }`}
      >
        <Icon className={`${compact ? "size-4 hidden sm:block" : "size-5"}`} />
        <div className="flex flex-col leading-tight">
          <p
            className={`${compact ? "text-sm" : "text-md"} font-bold tabular-nums`}
          >
            {value}
          </p>
          <p
            className={`${compact ? "text-[10px]" : "text-xs"} font-medium uppercase tracking-wide`}
          >
            {label}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
