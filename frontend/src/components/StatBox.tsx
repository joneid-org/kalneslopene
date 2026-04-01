import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";

type Color = "blue" | "orange" | "green" | "amber";

type StatBoxProps = {
  icon: LucideIcon;
  value: string | number | undefined;
  label: string;
  color: Color;
};

const colorMap: Record<
  Color,
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
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-100",
    iconBg: "bg-orange-100",
    icon: "text-orange-600",
    value: "text-orange-700",
    label: "text-orange-500",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
    icon: "text-green-600",
    value: "text-green-700",
    label: "text-green-500",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    iconBg: "bg-amber-100",
    icon: "text-amber-600",
    value: "text-amber-700",
    label: "text-amber-500",
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
          className={`text-base md:text-2xl font-bold tabular-nums leading-none ${c.value}`}
        >
          {value}
        </p>
        <p className={`text-xs font-medium uppercase tracking-wide ${c.label}`}>
          {label}
        </p>
      </CardContent>
    </Card>
  );
}
