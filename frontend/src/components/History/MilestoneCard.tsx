import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { cn } from "@/lib/utils.ts";
import type { MilestoneDTO } from "@/model/DTO.ts";

type Props = {
  milestone: MilestoneDTO;
  isOpen: boolean;
  onToggle: () => void;
  align?: "left" | "right";
};

export function MilestoneCard({
  milestone,
  isOpen,
  onToggle,
  align = "left",
}: Props) {
  const { year, title, summary, details, extra } = milestone;
  const alignRight = align === "right";

  return (
    <Card
      onClick={onToggle}
      className={cn(
        "cursor-pointer gap-0 rounded-xl py-0 card-hover",
        alignRight && "sm:text-right",
      )}
    >
      <CardContent className="p-3.5 sm:p-5">
        <div
          className={cn(
            "flex items-start justify-between gap-2",
            alignRight && "sm:flex-row-reverse",
          )}
        >
          <span className="inline-block rounded-md bg-brand-soft px-2.5 py-0.5 font-display text-xs font-extrabold tabular-nums text-brand-soft-foreground">
            {year}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180",
            )}
          />
        </div>

        <h3 className="mt-2 font-display text-[15px] font-bold leading-snug sm:text-[17px]">
          {title}
        </h3>
        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {summary}
        </p>

        {isOpen && (
          <div className="mt-3 space-y-3 border-t pt-3 text-left">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {details.map((detail) => {
                const [label, value] = detail.split(":");
                return (
                  <div key={label}>
                    <dt className="text-xs text-muted-foreground">{label}</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                );
              })}
            </dl>
            {extra && (
              <p className="border-l-2 border-primary pl-3 text-sm italic text-muted-foreground">
                {extra}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
