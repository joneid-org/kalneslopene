import type { RefObject } from "react";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox.tsx";
import type { UserRole } from "@/model/DTO.ts";

const ROLES: UserRole[] = ["ADMIN", "EDITOR"];

export function RoleCombobox({
  roles,
  onRolesChange,
  lockedRole,
  className,
  container,
}: {
  roles: UserRole[];
  onRolesChange: (roles: UserRole[]) => void;
  lockedRole?: UserRole;
  className?: string;
  container?: RefObject<HTMLElement | null>;
}) {
  return (
    <Combobox
      items={ROLES}
      multiple
      value={roles}
      onValueChange={(next: UserRole[]) =>
        onRolesChange(
          lockedRole && !next.includes(lockedRole)
            ? [...next, lockedRole]
            : next,
        )
      }
    >
      <ComboboxChips className={className}>
        <ComboboxValue>
          {roles.map((role) => (
            <ComboboxChip key={role} showRemove={role !== lockedRole}>
              {role}
            </ComboboxChip>
          ))}
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Velg roller" />
      </ComboboxChips>
      {/* Inside a Radix dialog the popup must live in the dialog content, or it lands under the modal's pointer-events block */}
      <ComboboxContent container={container}>
        <ComboboxEmpty>Ingen roller funnet.</ComboboxEmpty>
        <ComboboxList>
          {(role: UserRole) => (
            <ComboboxItem key={role} value={role}>
              {role}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
