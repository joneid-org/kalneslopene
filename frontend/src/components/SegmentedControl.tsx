import { cn } from "@/lib/utils.ts";

type SegmentedOption<T extends string | number> = {
  label: string;
  value: T;
};

type SegmentedControlProps<T extends string | number> = {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  tone?: "default" | "primary";
  className?: string;
};

export function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  tone = "default",
  className,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full p-1",
        tone === "primary" ? "bg-background" : "bg-muted",
        className,
      )}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[13px] font-semibold transition-colors",
              active
                ? tone === "primary"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
