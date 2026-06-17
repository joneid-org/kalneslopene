import { cn } from "@/lib/utils.ts";

type Tone = "default" | "primary" | "brand";

const toneClasses: Record<Tone, string> = {
  default: "text-foreground",
  primary: "text-primary",
  brand: "text-brand-soft-foreground",
};

type StatTileProps = {
  value: string | number | undefined;
  label: string;
  tone?: Tone;
};

export function StatTile({ value, label, tone = "default" }: StatTileProps) {
  return (
    <div className="rounded-[14px] border bg-card px-2 py-3.5 text-center md:py-4">
      <div
        className={cn(
          "font-display text-[22px] font-extrabold leading-none tabular-nums md:text-[28px]",
          toneClasses[tone],
        )}
      >
        {value ?? "–"}
      </div>
      <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
    </div>
  );
}
