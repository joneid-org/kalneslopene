import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClockIcon, ChevronLeftIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { RaceDateForm } from "@/components/admin/RaceDateForm.tsx";
import { SeasonDialog } from "@/components/admin/SeasonDialog.tsx";
import { UpcomingRacesCard } from "@/components/admin/UpcomingRacesCard.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { getDayAndMonth } from "@/lib/timeUtils.ts";
import { isPast } from "@/lib/utils.ts";
import type { RaceDTO } from "@/model/DTO.ts";

export function CRUDRaces() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const invalidateRaces = () =>
    qc.invalidateQueries({ queryKey: ["race", "getAll"] });

  const { data: races } = useQuery(QUERIES.race.getAllRaces);

  const upcoming = [...(races ?? [])]
    .filter((r) => !isPast(r))
    .sort((a, b) => a.raceDate.localeCompare(b.raceDate));

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

  const editMutation = useMutation({
    mutationFn: (raceDate: string) =>
      QUERIES.race
        .updateRace(editing!.uuid!, { ...editing!, raceDate })
        .queryFn(),
    onSuccess: () => {
      invalidateRaces();
      setEditing(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => QUERIES.race.deleteRace(uuid).queryFn(),
    onSuccess: () => {
      invalidateRaces();
      setDeleting(null);
    },
  });

  return (
    <div className="page-content max-w-3xl mx-auto space-y-6">
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

      <UpcomingRacesCard
        races={upcoming}
        onEdit={setEditing}
        onDelete={setDeleting}
      />

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Legg til løp</DialogTitle>
          </DialogHeader>
          <RaceDateForm
            submitLabel="Legg til"
            isPending={addMutation.isPending}
            onCancel={() => setShowAdd(false)}
            onSubmit={(raceDate) => addMutation.mutate(raceDate)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showSeason} onOpenChange={setShowSeason}>
        <SeasonDialog
          onClose={() => setShowSeason(false)}
          onCreated={invalidateRaces}
        />
      </Dialog>

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
            <RaceDateForm
              initialDate={editing.raceDate.slice(0, 16)}
              submitLabel="Lagre"
              isPending={editMutation.isPending}
              onCancel={() => setEditing(null)}
              onSubmit={(raceDate) => editMutation.mutate(raceDate)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(o) => {
          if (!o) setDeleting(null);
        }}
      >
        {deleting && (
          <ConfirmDeleteDialog
            title="Slett løp"
            description={
              <>
                Er du sikker på at du vil slette løpet{" "}
                <span className="font-semibold text-foreground">
                  {getDayAndMonth(deleting.raceDate)}
                </span>
                ? Dette kan ikke angres.
              </>
            }
            isPending={deleteMutation.isPending}
            onConfirm={() =>
              deleting.uuid && deleteMutation.mutate(deleting.uuid)
            }
            onClose={() => setDeleting(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
