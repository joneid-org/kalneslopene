import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { formatSecondsToTime, timeToSeconds } from "@/lib/timeUtils.ts";

export function TimeField({
  seconds,
  disabled,
  onChange,
  className,
}: {
  seconds: number | null;
  disabled?: boolean;
  onChange: (seconds: number | null) => void;
  className?: string;
}) {
  const [text, setText] = useState(
    seconds != null && seconds > 0 ? formatSecondsToTime(seconds) : "",
  );

  return (
    <Input
      placeholder="mm:ss"
      value={text}
      disabled={disabled}
      className={className}
      onChange={(e) => {
        const value = e.target.value;
        setText(value);
        const trimmed = value.trim();
        onChange(trimmed === "" ? null : timeToSeconds(trimmed));
      }}
    />
  );
}
