import { Card, CardContent } from "@/components/ui/card.tsx";
import type { MilestoneDTO } from "@/model/DTO.ts";

type Props = {
  milestone: MilestoneDTO;
};

export function MilestoneCard({ milestone }: Props) {
  const { title, summary } = milestone;

  return (
    <Card className="gap-0 rounded-2xl py-0 card-hover">
      <CardContent className="p-4 sm:p-6">
        <h3 className="mt-1 text-left font-display text-base font-bold leading-snug tracking-tight sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 whitespace-pre-line text-left text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
