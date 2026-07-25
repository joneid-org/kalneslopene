import { clsx } from "clsx";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { formatSecondsToTime, parseFlexibleTime } from "@/lib/timeUtils.ts";

export function TimeField({
  seconds,
  disabled,
  onBlur,
  className,
}: {
  seconds: number | null;
  disabled?: boolean;
  onBlur: (seconds: number | null) => void;
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
      className={clsx(
        className,
        invalid && "border-destructive focus-visible:ring-destructive",
      )}
      onChange={(e) => {
        const value = e.target.value;
        setText(value);
      }}
      onBlur={(e) => {
        const value = e.target.value;
        const next = value.trim();
        onBlur(next === "" ? null : parseFlexibleTime(next));
      }}
    />
  );
}
