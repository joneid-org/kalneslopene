import { useCallback, useState } from "react";
import type { OrganizerDTO } from "@/model/DTO.ts";

const STORAGE_KEY = "organizer-order:v1";

function loadOrder(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveOrder(uuids: string[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(uuids));
}

/** Returns organizers sorted by the saved order, with any new ones appended at the end. */
export function applySavedOrder(organizers: OrganizerDTO[]): OrganizerDTO[] {
  const order = loadOrder();
  if (order.length === 0) return organizers;
  const map = new Map(organizers.map((o) => [o.uuid ?? "", o]));
  const sorted: OrganizerDTO[] = [];
  for (const uuid of order) {
    const o = map.get(uuid);
    if (o) {
      sorted.push(o);
      map.delete(uuid);
    }
  }
  // Append any organizers not yet in the saved order
  for (const o of map.values()) sorted.push(o);
  return sorted;
}

export function useOrganizerOrder(organizers: OrganizerDTO[]) {
  const [ordered, setOrdered] = useState<OrganizerDTO[]>(() =>
    applySavedOrder(organizers),
  );
  const [lastInput, setLastInput] = useState(organizers);

  if (organizers !== lastInput) {
    setLastInput(organizers);
    setOrdered(applySavedOrder(organizers));
  }

  const move = useCallback((fromIndex: number, toIndex: number) => {
    setOrdered((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, item);
      saveOrder(next.map((o) => o.uuid ?? ""));
      return next;
    });
  }, []);

  const persistCurrent = useCallback((list: OrganizerDTO[]) => {
    saveOrder(list.map((o) => o.uuid ?? ""));
  }, []);

  return { ordered, move, persistCurrent };
}
