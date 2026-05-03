import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { MilestoneDTO } from "@/model/DTO.ts";

type Props = {
  milestone: MilestoneDTO;
  isOpen: boolean;
  onToggle: () => void;
};

export function MilestoneCard({ milestone, isOpen, onToggle }: Props) {
  const { year, title, summary, details, extra } = milestone;

  return (
    <Card
      className="flex-1 cursor-pointer transition-shadow hover:shadow-md"
      onClick={onToggle}
    >
      <CardContent className="pt-4 pb-4 space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-mono">
              {year}
            </Badge>
            <span className="font-semibold text-sm">{title}</span>
          </div>
          <ChevronDown
            className={`size-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </div>

        <p className="text-sm text-muted-foreground">{summary}</p>

        {isOpen && (
          <div className="pt-3 space-y-3 border-t mt-2">
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
              <p className="text-sm text-muted-foreground border-l-2 border-primary pl-3 italic">
                {extra}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
