import { ChevronRight, Trophy } from "lucide-react";
import { Link } from "react-router";
import { runnerStatisticsPath } from "@/lib/constants.ts";
import {
  extractYear,
  formatSecondsToTime,
  mapResultTimeToNumber,
} from "@/lib/timeUtils.ts";
import type { CourseRecordDTO } from "@/model/DTO.ts";

type Props = {
  male?: CourseRecordDTO;
  female?: CourseRecordDTO;
};

function RecordRow({
  label,
  record,
}: {
  label: string;
  record: CourseRecordDTO;
}) {
  return (
    <Link
      to={runnerStatisticsPath(record.runner.uuid)}
      className="flex items-center gap-3 rounded-xl bg-white/10 px-3 py-2.5 transition-colors hover:bg-white/15"
    >
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-wider text-white/60">
          {label}
          {record.raceInfo && ` · ${extractYear(record.raceInfo.raceDate)}`}
        </div>
        <div className="truncate text-sm font-semibold">
          {record.runner.name}
        </div>
      </div>
      <span className="font-display text-xl font-extrabold tabular-nums">
        {formatSecondsToTime(mapResultTimeToNumber(record.resultTime))}
      </span>
      <ChevronRight className="size-4 shrink-0 text-white/50" />
    </Link>
  );
}

export function CourseRecordCard({ male, female }: Props) {
  if (!male && !female) return null;

  return (
    <div className="rounded-2xl bg-brand-ink p-4 text-white md:p-5">
      <div className="mb-3 flex items-center gap-2.5">
        <div className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-brand text-brand-foreground">
          <Trophy className="size-4" />
        </div>
        <h2 className="font-display text-base font-extrabold tracking-tight">
          Løyperekorder
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {male && <RecordRow label="Menn" record={male} />}
        {female && <RecordRow label="Kvinner" record={female} />}
      </div>
    </div>
  );
}
