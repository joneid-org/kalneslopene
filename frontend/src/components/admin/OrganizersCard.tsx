import { GripVertical, PencilIcon, UsersIcon } from "lucide-react";
import { useRef, useState } from "react";
import { DeleteButton } from "@/components/admin/DeleteButton.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import type { OrganizerDTO } from "@/model/DTO.ts";

export function OrganizersCard({
  organizers,
  onEdit,
  onDelete,
  onReorder,
}: {
  organizers: OrganizerDTO[];
  onEdit: (organizer: OrganizerDTO) => void;
  onDelete: (organizer: OrganizerDTO) => void;
  onReorder: (from: number, to: number) => void;
}) {
  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragIndex.current = idx;
  };

  const handleDrop = (toIdx: number) => {
    if (dragIndex.current !== null && dragIndex.current !== toIdx) {
      onReorder(dragIndex.current, toIdx);
    }
    dragIndex.current = null;
    setDragOver(null);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <UsersIcon className="size-4 text-primary" />
          Alle arrangører
        </CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Dra i <GripVertical className="inline size-3" />
          -ikonet for å endre rekkefølge.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {organizers.length === 0 ? (
          <p className="text-sm text-muted-foreground px-4 py-6 text-center">
            Ingen arrangører registrert.
          </p>
        ) : (
          <ul className="divide-y">
            {organizers.map((org, idx) => (
              <li
                key={org.uuid ?? org.name}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(idx);
                }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(idx)}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                  dragOver === idx
                    ? "bg-secondary border-t-2 border-primary"
                    : "hover:bg-muted/40"
                }`}
              >
                <span className="cursor-grab active:cursor-grabbing text-muted-foreground/40 hover:text-muted-foreground shrink-0">
                  <GripVertical className="size-4" />
                </span>

                {org.image ? (
                  <img
                    src={org.image}
                    alt={org.name}
                    className="size-8 rounded-full object-cover border border-muted shrink-0"
                  />
                ) : (
                  <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
                    {org.initials}
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-sm font-medium">{org.name}</span>
                    {org.contactPerson && (
                      <Badge variant="outline" className="text-[10px] py-0 h-4">
                        Kontakt
                      </Badge>
                    )}
                  </div>
                  {org.responsibility.length > 0 && (
                    <p className="text-xs text-muted-foreground truncate">
                      {org.responsibility.join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="size-7 p-0"
                    onClick={() => onEdit(org)}
                  >
                    <PencilIcon className="size-3.5" />
                  </Button>
                  <DeleteButton onClick={() => onDelete(org)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
