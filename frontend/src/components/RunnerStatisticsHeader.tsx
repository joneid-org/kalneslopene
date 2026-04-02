import { Badge } from "@/components/ui/badge.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

type Props = {
  runner: RunnerDTO;
};

export default function RunnerStatisticsHeader({ runner }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle className="text-base">{runner.name}</CardTitle>
            <div className="flex gap-2 mt-1.5">
              <Badge variant="secondary">{runner.gender}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
