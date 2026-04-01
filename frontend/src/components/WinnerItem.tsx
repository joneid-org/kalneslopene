import { TimerIcon } from "lucide-react";
import type { RaceRunnerDTO } from "@/model/DTO.ts";
import { formatSecondsToTime, mapResultTimeToNumber } from "@/lib/TimeUtils.ts";

type WinnerItemProps = {
  result: RaceRunnerDTO;
  label: string;
  iconColor: string;
  bgColor: string;
};

export default function WinnerItem({
  result,
  label,
  iconColor,
  bgColor,
}: WinnerItemProps) {
  return (
    <div className="flex items-center gap-2 md:gap-3">
      <div className={`${bgColor} rounded-full p-1.5 md:p-2.5 shrink-0`}>
        <TimerIcon className={`size-3.5 md:size-5 ${iconColor}`} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-semibold truncate">{result.runner.name}</p>
        <p className="text-xs tabular-nums text-muted-foreground">
          {formatSecondsToTime(mapResultTimeToNumber(result.resultTime))}
        </p>
      </div>
    </div>
  );
}
