import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CalendarClockIcon,
  ChevronLeftIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { kyClient } from "@/api/queryClient.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Separator } from "@/components/ui/separator.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import {
  formatDateFull,
  formatDDMonth,
  formatTimeStamp,
  raceDateToSortKey,
} from "@/lib/timeUtils.ts";
import type { RaceDTO } from "@/model/DTO.ts"; // ─── helpers ──────────────────────────────────────────────────────────────────

// ─── helpers ──────────────────────────────────────────────────────────────────

function isPast(race: RaceDTO): boolean {
  return raceDateToSortKey(race.raceDate) < new Date().toISOString();
}

/** Generate ISO datetime strings "YYYY-MM-DDTHH:mm:ss" spaced every `intervalDays` days */
function generateRaceDates(
  startDate: string,
  endDate: string,
  timeOfDay: string,
  intervalDays: number,
): string[] {
  const dates: string[] = [];
  const [sh, sm] = timeOfDay.split(":").map(Number);
  const [sy, smo, sd] = startDate.split("-").map(Number);
  const [ey, emo, ed] = endDate.split("-").map(Number);
  const end = new Date(ey, emo - 1, ed);

  let cur = new Date(sy, smo - 1, sd);
  while (cur <= end) {
    const y = cur.getFullYear();
    const mo = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    const h = String(sh).padStart(2, "0");
    const mi = String(sm).padStart(2, "0");
    dates.push(`${y}-${mo}-${d}T${h}:${mi}:00`);
    cur = new Date(
      cur.getFullYear(),
      cur.getMonth(),
      cur.getDate() + intervalDays,
    );
  }
  return dates;
}

// ─── SeasonDialog ─────────────────────────────────────────────────────────────

type PreviewRace = { date: string; time: string };

function SeasonDialog({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("18:00");
  const [interval, setInterval] = useState("7");
  const [preview, setPreview] = useState<PreviewRace[] | null>(null);

  const createMutation = useMutation({
    mutationFn: (races: Omit<RaceDTO, "uuid">[]) =>
      QUERIES.race.createRaces(races as RaceDTO[]).queryFn(),
    onSuccess: () => {
      onCreated();
      onClose();
    },
  });

  const handlePreview = () => {
    const days = parseInt(interval, 10);
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
    parseInt(interval, 10) >= 1 &&
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
              value={interval}
              onChange={(e) => {
                setInterval(e.target.value);
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

// ─── UpcomingRaceForm ─────────────────────────────────────────────────────────

function UpcomingRaceForm({
  race,
  onClose,
  onSaved,
}: {
  race: RaceDTO;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [raceDate, setRaceDate] = useState(
    raceDateToSortKey(race.raceDate).slice(0, 16),
  );

  const saveMutation = useMutation({
    mutationFn: () =>
      kyClient
        .patch(`/api/races/${race.uuid}`, { json: { ...race, raceDate } })
        .json<RaceDTO>(),
    onSuccess: () => {
      onSaved();
      onClose();
    },
  });

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Dato og tid</Label>
        <Input
          type="datetime-local"
          value={raceDate}
          onChange={(e) => setRaceDate(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          disabled={!raceDate || saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
        >
          Lagre
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── SingleRaceForm ───────────────────────────────────────────────────────────

function SingleRaceForm({
  onClose,
  onSaved,
  isPending,
}: {
  onClose: () => void;
  onSaved: (raceDate: string) => void;
  isPending: boolean;
}) {
  const [raceDate, setRaceDate] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <Label>Dato og tid</Label>
        <Input
          type="datetime-local"
          value={raceDate}
          onChange={(e) => setRaceDate(e.target.value)}
        />
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Avbryt
        </Button>
        <Button
          disabled={!raceDate || isPending}
          onClick={() => onSaved(raceDate)}
        >
          Legg til
        </Button>
      </DialogFooter>
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export function CRUDRaces() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidateRaces = () =>
    qc.invalidateQueries({ queryKey: ["race", "getAll"] });

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const upcoming = [...(races ?? [])]
    .filter((r) => !isPast(r))
    .sort((a, b) =>
      raceDateToSortKey(a.raceDate).localeCompare(
        raceDateToSortKey(b.raceDate),
      ),
    );

  const [showSeason, setShowSeason] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<RaceDTO | null>(null);
  const [deleting, setDeleting] = useState<RaceDTO | null>(null);

  const addMutation = useMutation({
    mutationFn: (raceDate: string) =>
      QUERIES.race.createRaces([{ raceDate } as RaceDTO]).queryFn(),
    onSuccess: () => {
      invalidateRaces();
      setShowAdd(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) =>
      kyClient.delete(`/api/races/${uuid}`).json<void>(),
    onSuccess: () => {
      invalidateRaces();
      setDeleting(null);
    },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Button
        variant="ghost"
        className="gap-1.5 -ml-2 text-muted-foreground"
        onClick={() => navigate("/admin")}
      >
        <ChevronLeftIcon className="size-4" />
        Tilbake
      </Button>

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Administrer løp</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-1.5"
            onClick={() => setShowAdd(true)}
          >
            <PlusIcon className="size-4" />
            Legg til løp
          </Button>
          <Button className="gap-1.5" onClick={() => setShowSeason(true)}>
            <CalendarClockIcon className="size-4" />
            Start ny sesong
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarClockIcon className="size-4 text-primary" />
            Kommende løp
            <Badge variant="secondary">{upcoming.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dato</TableHead>
                <TableHead>Tid</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {upcoming.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="text-center text-muted-foreground py-6 text-sm italic"
                  >
                    Ingen kommende løp registrert.
                  </TableCell>
                </TableRow>
              )}
              {upcoming.map((race) => (
                <TableRow key={race.uuid}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CalendarClockIcon className="size-3.5 text-primary shrink-0" />
                      <span className="font-medium">
                        {formatDDMonth(race.raceDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">
                    {formatTimeStamp(race.raceDate)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0"
                        onClick={() => setEditing(race)}
                      >
                        <PencilIcon className="size-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                        onClick={() => setDeleting(race)}
                      >
                        <Trash2Icon className="size-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add single race dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til løp</DialogTitle>
          </DialogHeader>
          <SingleRaceForm
            onClose={() => setShowAdd(false)}
            onSaved={(raceDate) => addMutation.mutate(raceDate)}
            isPending={addMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      {/* Season dialog */}
      <Dialog open={showSeason} onOpenChange={setShowSeason}>
        <SeasonDialog
          onClose={() => setShowSeason(false)}
          onCreated={invalidateRaces}
        />
      </Dialog>

      {/* Edit dialog */}
      <Dialog
        open={!!editing}
        onOpenChange={(o) => {
          if (!o) setEditing(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rediger planlagt løp</DialogTitle>
          </DialogHeader>
          {editing && (
            <UpcomingRaceForm
              race={editing}
              onClose={() => setEditing(null)}
              onSaved={invalidateRaces}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Slett løp</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Er du sikker på at du vil slette løpet{" "}
            <span className="font-semibold text-foreground">
              {deleting && formatDDMonth(deleting.raceDate)}
            </span>
            ? Dette kan ikke angres.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Avbryt
            </Button>
            <Button
              variant="destructive"
              disabled={deleteMutation.isPending}
              onClick={() =>
                deleting?.uuid && deleteMutation.mutate(deleting.uuid)
              }
            >
              Slett
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
