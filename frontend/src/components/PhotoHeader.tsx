import { Camera, ListOrdered } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardHeader, CardTitle } from "@/components/ui/card.tsx";

type PhotoHeaderProps = {
  title: string;
  photoCount: number;
  photographers: string[];
  resultsPath?: string;
};

export default function PhotoHeader({
  title,
  photoCount,
  photographers,
  resultsPath,
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
          {resultsPath && (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="shrink-0 text-xs gap-1.5"
            >
              <Link to={resultsPath}>
                <ListOrdered className="size-3.5" />
                Se resultater
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
