import type { DraftEntry } from "@/model/DTO.ts";

export function genderLabel(gender: string): string {
  const g = gender.toUpperCase();
  if (g === "MALE") return "Mann";
  if (g === "FEMALE") return "Kvinne";
  return gender;
}

export function entryHasTime(entry: DraftEntry): boolean {
  return entry.hideTime || entry.resultTimeSeconds != null;
}

export function newEntry(fields: Partial<DraftEntry>): DraftEntry {
  return {
    clientId: crypto.randomUUID(),
    runnerUuid: null,
    name: "",
    gender: "MALE",
    resultTimeSeconds: null,
    hideTime: false,
    createdThisSession: false,
    ...fields,
  };
}
