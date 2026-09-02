import { clsx } from "clsx";
import { type Ref, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { formatSecondsToTime, parseFlexibleTime } from "@/lib/timeUtils.ts";

function toText(seconds: number | null) {
  return seconds != null && seconds > 0 ? formatSecondsToTime(seconds) : "";
}

export function TimeField({
  seconds,
  disabled,
  onCommit,
  onEnter,
  inputRef,
  className,
}: {
  seconds: number | null;
  disabled?: boolean;
  onCommit: (seconds: number | null) => void;
  onEnter?: (direction: 1 | -1) => void;
  inputRef?: Ref<HTMLInputElement>;
  className?: string;
}) {
  const [text, setText] = useState(() => toText(seconds));
  const committed = useRef(text);

  // A time changed from the outside (saved, cleared by "Deltatt") wins over the draft.
  useEffect(() => {
    committed.current = toText(seconds);
    setText(committed.current);
  }, [seconds]);

  const trimmed = text.trim();
  const invalid = trimmed !== "" && parseFlexibleTime(trimmed) === null;

  const commit = () => {
    if (trimmed === committed.current) return;
    committed.current = trimmed;
    onCommit(trimmed === "" ? null : parseFlexibleTime(trimmed));
  };

  return (
    <Input
      ref={inputRef}
      placeholder="mm:ss"
      value={text}
      disabled={disabled}
      aria-invalid={invalid}
      className={clsx(
        className,
        invalid && "border-destructive focus-visible:ring-destructive",
      )}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (invalid) return;
          commit();
          onEnter?.(e.shiftKey ? -1 : 1);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setText(committed.current);
        }
      }}
      onBlur={commit}
    />
  );
}
