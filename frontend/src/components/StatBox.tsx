import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";

type StatBoxProps = {
  icon: LucideIcon;
  value: string | number | undefined;
  label: string;
  compact?: boolean;
};

// const colorMap: Record<
//   Color,
//   {
//     bg: string;
//     border: string;
//     iconBg: string;
//     icon: string;
//     value: string;
//     label: string;
//   }
// > = {
//   blue: {
//     bg: "bg-blue-50",
//     border: "border-blue-100",
//     iconBg: "bg-blue-100",
//     icon: "text-blue-600",
//     value: "text-blue-700",
//     label: "text-blue-500",
//   },
//   orange: {
//     bg: "bg-orange-50",
//     border: "border-orange-100",
//     iconBg: "bg-orange-100",
//     icon: "text-orange-600",
//     value: "text-orange-700",
//     label: "text-orange-500",
//   },
//   green: {
//     bg: "bg-green-50",
//     border: "border-green-100",
//     iconBg: "bg-green-100",
//     icon: "text-green-600",
//     value: "text-green-700",
//     label: "text-green-500",
//   },
//   amber: {
//     bg: "bg-amber-50",
//     border: "border-amber-100",
//     iconBg: "bg-amber-100",
//     icon: "text-amber-600",
//     value: "text-amber-700",
//     label: "text-amber-500",
//   },
//   red: {
//     bg: "bg-red-50",
//     border: "border-red-100",
//     iconBg: "bg-red-100",
//     icon: "text-red-600",
//     value: "text-red-700",
//     label: "text-red-500",
//   },
// };

export default function StatBox({
  icon: Icon,
  value,
  label,
  compact,
}: StatBoxProps) {
  return (
    <Card>
      <CardContent
        className={`flex items-center gap-1.5 justify-center${compact ? " py-1 px-2" : ""}`}
      >
        <div
          className={`rounded-full p-0.5 ${compact ? "hidden sm:block" : ""}`}
        >
          <Icon className={compact ? "size-4" : "size-5"} />
        </div>
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
