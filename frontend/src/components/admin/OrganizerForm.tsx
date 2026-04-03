import { useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import type { OrganizerDTO } from "@/model/DTO.ts";

export function OrganizerForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel,
}: {
  initial: Partial<OrganizerDTO>;
  onSubmit: (organizer: Omit<OrganizerDTO, "uuid">) => void;
  onCancel: () => void;
  submitLabel: string;
}) {
  const [name, setName] = useState(initial.name ?? "");
  const [initials, setInitials] = useState(initial.initials ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [email, setEmail] = useState(initial.email ?? "");
  const [responsibilityInput, setResponsibilityInput] = useState(
    (initial.responsibility ?? []).join(", "),
  );
  const [contactPerson, setContactPerson] = useState(
    initial.contactPerson ?? false,
  );

  const handleSubmit = () => {
    const responsibility = responsibilityInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    onSubmit({
      name: name.trim(),
      initials: initials.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      responsibility,
      contactPerson,
    });
  };

  const isValid = name.trim() && initials.trim();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Navn</Label>
          <Input
            placeholder="Fornavn Etternavn"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Initialer</Label>
          <Input
            placeholder="FE"
            maxLength={4}
            value={initials}
            onChange={(e) => setInitials(e.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label>Ansvarsområder</Label>
        <Input
          placeholder="Start, Målgang, Tidtaking"
          value={responsibilityInput}
          onChange={(e) => setResponsibilityInput(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">Kommaseparert liste</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Telefon</Label>
          <Input
            placeholder="+47 000 00 000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>E-post</Label>
          <Input
            type="email"
            placeholder="navn@eksempel.no"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Switch
          id="contactPerson"
          checked={contactPerson}
          onCheckedChange={setContactPerson}
        />
        <Label htmlFor="contactPerson">Kontaktperson</Label>
      </div>
      <FormFooter
        submitLabel={submitLabel}
        disabled={!isValid}
        onCancel={onCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
