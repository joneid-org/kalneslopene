import { TimerIcon } from "lucide-react";
import type { Result } from "../data/mockdata.ts";

type WinnerItemProps = {
  result: Result;
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
        <p className="text-[10px] md:text-xs text-muted-foreground">{label}</p>
        <p className="text-xs md:text-base font-semibold truncate">
          {result.runnerName}
        </p>
        <p className="text-xs md:text-sm tabular-nums text-muted-foreground">
          {result.time}
        </p>
      </div>
    </div>
  );
}
