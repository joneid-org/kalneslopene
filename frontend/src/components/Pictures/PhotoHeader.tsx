import { Camera, Check, ListOrdered, Pencil } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";

type PhotoHeaderProps = {
  title: string;
  photoCount: number;
  photographers: string[];
  resultsPath?: string;
  isAdmin?: boolean;
  isEditing?: boolean;
  onToggleEditing?: () => void;
};

export default function PhotoHeader({
  title,
  photoCount,
  photographers,
  resultsPath,
  isAdmin,
  isEditing,
  onToggleEditing,
}: PhotoHeaderProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            <div className="flex flex-col gap-0.5 mt-1">
              <p className="text-xs text-muted-foreground">
                {photoCount} bilder
              </p>
              {photographers.length > 0 && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Camera className="size-3 shrink-0" />
                  Foto: {photographers.join(", ")}
                </p>
              )}
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
                onClick={onToggleEditing}
              >
                {isEditing ? (
                  <Check className="size-3.5" />
                ) : (
                  <Pencil className="size-3.5" />
                )}
                {isEditing ? "Ferdig" : "Rediger"}
              </Button>
            )}
            {resultsPath && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="text-xs gap-1.5"
              >
                <Link to={resultsPath}>
                  <ListOrdered className="size-3.5" />
                  Se resultater
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
