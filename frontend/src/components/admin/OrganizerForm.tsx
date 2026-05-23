import { ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { FormFooter } from "@/components/admin/FormFooter.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Switch } from "@/components/ui/switch.tsx";
import { readFileAsDataURL } from "@/lib/utils.ts";
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
  const [responsibilityInput, setResponsibilityInput] = useState(() =>
    (initial.responsibility ?? []).join(", "),
  );
  const [contactPerson, setContactPerson] = useState(
    initial.contactPerson ?? false,
  );
  const [image, setImage] = useState<string | undefined>(initial.image);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(await readFileAsDataURL(file));
  };

  const handleSubmit = () => {
    const responsibility = responsibilityInput.split(",").flatMap((s) => {
      const trimmed = s.trim();
      return trimmed ? [trimmed] : [];
    });
    onSubmit({
      name: name.trim(),
      initials: initials.trim(),
      phone: phone.trim() || undefined,
      email: email.trim() || undefined,
      responsibility,
      contactPerson,
      image,
    });
  };

  const isValid = name.trim() && initials.trim();

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Profilbilde</Label>
        <input
          ref={imageRef}
          type="file"
          accept="image/*"
          aria-label="Last opp profilbilde"
          className="hidden"
          onChange={handleImageChange}
        />
        <div className="flex items-center gap-3">
          {image ? (
            <div className="relative size-16 rounded-full overflow-hidden border-2 border-muted shrink-0">
              <img
                src={image}
                alt="Profilbilde"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImage(undefined);
                  if (imageRef.current) imageRef.current.value = "";
                }}
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              >
                <X className="size-4 text-white" />
              </button>
            </div>
          ) : (
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary border-2 border-dashed border-primary/20 shrink-0">
              {initials || "?"}
            </div>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => imageRef.current?.click()}
          >
            <ImagePlus className="size-4" />
            {image ? "Bytt bilde" : "Last opp bilde"}
          </Button>
        </div>
      </div>

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
