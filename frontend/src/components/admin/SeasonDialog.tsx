import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { kyClient } from "@/api/queryClient.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import { formatDateFull, generateRaceDates } from "@/lib/timeUtils.ts";
import type { RaceDTO, RaceInput } from "@/model/DTO.ts";

type PreviewRace = { date: string; time: string };

export function createRaces(races: RaceInput[]) {
  return kyClient.post("/api/races", { json: races }).json<RaceDTO[]>();
}

export function SeasonDialog({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const todayStr = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("18:00");
  const [intervalDays, setIntervalDays] = useState("7");
  const [preview, setPreview] = useState<PreviewRace[] | null>(null);

  const createMutation = useMutation({
    mutationFn: (races: RaceInput[]) => createRaces(races),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["race", "getAll"] });
      onClose();
    },
  });

  const handlePreview = () => {
    const days = parseInt(intervalDays, 10);
    if (!startDate || !endDate || !timeOfDay || !days || days < 1) return;
    const dates = generateRaceDates(startDate, endDate, timeOfDay, days);
    setPreview(
      dates.map((d) => ({ date: d.slice(0, 10), time: d.slice(11, 16) })),
    );
  };

  const updatePreviewTime = (index: number, time: string) => {
    setPreview((prev) =>
      prev ? prev.map((r, i) => (i === index ? { ...r, time } : r)) : prev,
    );
  };

  const handleCreate = () => {
    if (!preview) return;
    createMutation.mutate(
      preview.map(({ date, time }) => ({ raceDate: `${date}T${time}:00` })),
    );
  };

  const canPreview =
    !!startDate &&
    !!endDate &&
    !!timeOfDay &&
    parseInt(intervalDays, 10) >= 1 &&
    endDate >= startDate;

  return (
    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Start sesong</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Startdato</Label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPreview(null);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Sluttdato</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPreview(null);
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label>Starttidspunkt</Label>
            <Input
              type="time"
              value={timeOfDay}
              onChange={(e) => {
                setTimeOfDay(e.target.value);
                setPreview(null);
              }}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Intervall (dager)</Label>
            <Input
              type="number"
              min={1}
              placeholder="7"
              value={intervalDays}
              onChange={(e) => {
                setIntervalDays(e.target.value);
                setPreview(null);
              }}
            />
          </div>
        </div>

        <Button
          variant="outline"
          className="w-full"
          disabled={!canPreview}
          onClick={handlePreview}
        >
          Forhåndsvis løp
        </Button>

        {preview && (
          <>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {preview.length} løp vil bli opprettet:
              </p>
              <div className="border rounded-md divide-y max-h-52 overflow-y-auto text-sm">
                {preview.map((r, i) => (
                  <div
                    key={r.date}
                    className="px-3 py-1.5 flex items-center justify-between gap-3"
                  >
                    <span className="text-muted-foreground">
                      {formatDateFull(r.date)}
                    </span>
                    <Input
                      type="time"
                      value={r.time}
                      onChange={(e) => updatePreviewTime(i, e.target.value)}
                      className="h-7 w-24 text-xs tabular-nums px-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          disabled={!preview || createMutation.isPending}
          onClick={handleCreate}
        >
          Opprett {preview ? `${preview.length} løp` : "løp"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}
