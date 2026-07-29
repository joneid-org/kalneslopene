import { InfoIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  PRACTICAL_INFO,
  PRACTICAL_INFO_FOOTNOTE,
  PRACTICAL_INFO_INTRO,
} from "@/lib/constants.ts";

export default function PracticalInfoBlock() {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center gap-2 text-primary">
          <InfoIcon className="size-5" />
          <span className="font-display text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
            Praktisk info
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {PRACTICAL_INFO_INTRO}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PRACTICAL_INFO.map(({ title, icon: Icon, text }) => (
            <div
              key={title}
              className="flex gap-3 bg-background border rounded-xl p-4"
            >
              <div className="size-9 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                <Icon className="size-[18px] text-secondary-foreground" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold leading-tight mb-1">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          {PRACTICAL_INFO_FOOTNOTE}
        </p>
      </CardContent>
    </Card>
  );
}
