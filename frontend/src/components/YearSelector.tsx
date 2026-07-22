import { SegmentedControl } from "@/components/SegmentedControl.tsx";

export const ALL_YEARS = "all";
export type YearValue = number | typeof ALL_YEARS;

type Props = {
  years: number[];
  value: YearValue;
  onChange: (value: YearValue) => void;
  includeAll?: boolean;
  tone?: "default" | "primary";
};

export function YearSelector({
  years,
  value,
  onChange,
  includeAll = false,
  tone = "default",
}: Props) {
  const options = [
    ...(includeAll ? [{ label: "Alle", value: ALL_YEARS }] : []),
    ...years.map((y) => ({ label: String(y), value: String(y) })),
  ];

  return (
    <SegmentedControl
      fullWidth
      tone={tone}
      options={options}
      value={String(value)}
      onChange={(v) =>
        onChange(v === ALL_YEARS ? ALL_YEARS : Number.parseInt(v, 10))
      }
    />
  );
}
