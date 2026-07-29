import { z } from "zod";
import { mapResultTimeToNumber } from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceInput, RaceRunnerDTO } from "@/model/DTO.ts";

/** Blank-or-number text input: trimmed, range-checked, emitted as number | undefined. */
const numberField = (min: number, max: number) =>
  z
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : Number(value)))
    .refine(
      (value) => value === undefined || (value >= min && value <= max),
      `Må være et tall mellom ${min} og ${max}`,
    );

export const raceFormSchema = z.object({
  symbol: z.string().transform((value) => value || undefined),
  temperature: numberField(-60, 60),
  windSpeed: numberField(0, 120),
  precipitation: numberField(0, 500),
  windDirection: z.number().min(0).max(360).nullable(),
  courseCondition: z.string().trim().max(200, "Maks 200 tegn"),
});

/** String-backed mirror of WeatherDto + course condition for the admin inputs. */
export type RaceForm = z.input<typeof raceFormSchema>;
/** Same fields after validation: numbers parsed, blanks dropped. */
export type RaceValues = z.output<typeof raceFormSchema>;

export const runnerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Navnet kan ikke være tomt")
    .max(100, "Maks 100 tegn"),
  gender: z.enum(["MALE", "FEMALE"]),
});

export type RunnerFormValues = z.infer<typeof runnerFormSchema>;

export type RacePatch = Omit<RaceInput, "raceDate">;

export function raceToForm({ weather, courseCondition }: RaceDTO): RaceForm {
  return {
    symbol: weather?.symbol ?? "",
    temperature: weather?.temperature?.toString() ?? "",
    windSpeed: weather?.windSpeed?.toString() ?? "",
    precipitation: weather?.precipitation?.toString() ?? "",
    windDirection: weather?.windDirection ?? null,
    courseCondition: courseCondition ?? "",
  };
}

/**
 * Sanitized race patch, or null when a field is invalid (nothing is then persisted).
 * Blank fields become undefined so they are cleared on save; weather stays undefined
 * when nothing is filled in at all, leaving stored weather untouched.
 */
export function formToRace(form: RaceForm): RacePatch | null {
  const parsed = raceFormSchema.safeParse(form);
  if (!parsed.success) return null;

  const { courseCondition, ...weather } = parsed.data;
  return {
    weather: Object.values(weather).some((value) => value != null)
      ? weather
      : undefined,
    courseCondition: courseCondition || undefined,
  };
}

export { genderLabel } from "@/lib/utils.ts";

/** Seconds parsed from a RaceRunnerDTO's ISO duration, or null when no time. */
export function entrySeconds(entry: RaceRunnerDTO): number | null {
  const seconds = mapResultTimeToNumber(entry.resultTime);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

export function entryHasTime(entry: RaceRunnerDTO): boolean {
  return entry.hideTime || entrySeconds(entry) != null;
}
