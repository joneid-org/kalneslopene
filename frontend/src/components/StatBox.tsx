import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";

type StatBoxProps = {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: "blue" | "emerald" | "amber" | "pink" | "violet" | "rose";
};

const colorMap: Record<
  StatBoxProps["color"],
  {
    bg: string;
    border: string;
    iconBg: string;
    icon: string;
    value: string;
    label: string;
  }
> = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
    icon: "text-blue-600",
    value: "text-blue-700",
    label: "text-blue-500",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    iconBg: "bg-emerald-100",
    icon: "text-emerald-600",
    value: "text-emerald-700",
    label: "text-emerald-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
    value: "text-amber-700",
    label: "text-amber-500",
  },
  pink: {
    bg: "bg-pink-50",
    border: "border-pink-100",
    iconBg: "bg-pink-100",
    icon: "text-pink-600",
    value: "text-pink-700",
    label: "text-pink-500",
  },
  violet: {
    bg: "bg-violet-50",
    border: "border-violet-100",
    iconBg: "bg-violet-100",
    icon: "text-violet-600",
    value: "text-violet-700",
    label: "text-violet-500",
  },
  rose: {
    bg: "bg-rose-50",
    border: "border-rose-100",
    iconBg: "bg-rose-100",
    icon: "text-rose-600",
    value: "text-rose-700",
    label: "text-rose-500",
  },
};

export default function StatBox({
  icon: Icon,
  value,
  label,
  color,
}: StatBoxProps) {
  const c = colorMap[color];
  return (
    <Card className={`${c.bg} border ${c.border}`}>
      <CardContent className="flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
        <div className={`${c.iconBg} rounded-full p-1.5 md:p-2.5`}>
          <Icon className={`size-4 md:size-6 ${c.icon}`} />
        </div>
        <p
          className={`text-base sm:text-lg md:text-2xl font-bold ${c.value} tabular-nums leading-none`}
        >
          {value}
        </p>
        <p
          className={`text-[10px] md:text-xs ${c.label} font-medium uppercase tracking-wide`}
        >
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
