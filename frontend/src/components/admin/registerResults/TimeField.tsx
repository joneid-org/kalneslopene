import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { formatSecondsToTime, parseFlexibleTime } from "@/lib/timeUtils.ts";

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

  const trimmed = text.trim();
  const invalid = trimmed !== "" && parseFlexibleTime(trimmed) === null;

  return (
    <Input
      placeholder="mm:ss"
      value={text}
      disabled={disabled}
      aria-invalid={invalid}
      className={`${className ?? ""} ${invalid ? "border-destructive focus-visible:ring-destructive" : ""}`}
      onChange={(e) => {
        const value = e.target.value;
        setText(value);
        const next = value.trim();
        onChange(next === "" ? null : parseFlexibleTime(next));
      }}
    />
  );
}
