import { PencilIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import type { MilestoneDTO } from "@/model/DTO.ts";

type Props = {
  milestone: MilestoneDTO;
  onEdit?: () => void;
};

export function MilestoneCard({ milestone, onEdit }: Props) {
  const { year, title, summary } = milestone;

  const card = (
    <Card className="gap-0 rounded-2xl py-0 card-hover">
      <CardContent className="p-4 sm:p-6">
        {onEdit && (
          <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-primary">
            <PencilIcon className="size-3" />
            Rediger
          </span>
        )}
        <h3 className="mt-1 text-left font-display text-base font-bold leading-snug tracking-tight sm:text-lg">
          {title}
        </h3>
        <p className="mt-2 whitespace-pre-line text-left text-[13px] leading-relaxed text-muted-foreground sm:text-sm">
          {summary}
        </p>
      </CardContent>
    </Card>
  );

  if (!onEdit) return card;

  return (
    <button
      type="button"
      aria-label={`Rediger milepælen ${year} – ${title}`}
      onClick={onEdit}
      className="block w-full cursor-pointer rounded-2xl text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {card}
    </button>
  );
}
