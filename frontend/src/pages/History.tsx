import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, Quote } from "lucide-react";
import { useState } from "react";
import { MUTATIONS } from "@/api/mutations.ts";
import { QUERIES } from "@/api/queries.ts";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog.tsx";
import { MilestoneForm } from "@/components/admin/MilestoneForm.tsx";
import { MilestoneCard } from "@/components/History/MilestoneCard.tsx";
import { getMilestoneIcon } from "@/components/History/milestoneIcons.ts";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { useAuth } from "@/hooks/useAuth.ts";
import { cn } from "@/lib/utils.ts";
import type { MilestoneDTO, MilestoneInput } from "@/model/DTO.ts";

export function History() {
  const { isAuthenticated } = useAuth();
  const qc = useQueryClient();

  const { data: milestones = [] } = useQuery(
    QUERIES.milestone.getAllMilestones,
  );

  const invalidateMilestones = () =>
    qc.invalidateQueries({ queryKey: ["milestone"] });

  const [showAdd, setShowAdd] = useState(false);
  const addMutation = useMutation({
    mutationFn: (milestone: MilestoneInput) =>
      MUTATIONS.milestone.createMilestone(milestone),
    onSuccess: () => {
      invalidateMilestones();
      setShowAdd(false);
    },
  });

  const [editing, setEditing] = useState<MilestoneDTO | null>(null);
  const editMutation = useMutation({
    mutationFn: ({
      uuid,
      milestone,
    }: {
      uuid: string;
      milestone: MilestoneInput;
    }) => MUTATIONS.milestone.updateMilestone(uuid, milestone),
    onSuccess: () => {
      invalidateMilestones();
      setEditing(null);
    },
  });

  const [deleting, setDeleting] = useState<MilestoneDTO | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => MUTATIONS.milestone.deleteMilestone(uuid),
    onSuccess: () => {
      invalidateMilestones();
      setDeleting(null);
    },
  });

  const sortedMilestones = [...milestones].sort((a, b) => {
    const yearA = Number.parseInt(a.year, 10);
    const yearB = Number.parseInt(b.year, 10);
    return (
      (Number.isNaN(yearA) ? Number.POSITIVE_INFINITY : yearA) -
      (Number.isNaN(yearB) ? Number.POSITIVE_INFINITY : yearB)
    );
  });

  return (
    <div className="page-content">
      <div className="flex flex-col gap-8 sm:gap-14">
        <section className="mx-auto max-w-6xl pt-2 text-center sm:pt-8">
          <span className="inline-block rounded-full bg-secondary px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:px-3.5 sm:text-[11px] sm:tracking-[0.16em]">
            Siden 1978
          </span>
          <h1 className="mt-4 font-display text-[26px] font-black leading-[1.05] tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl">
            Historien om Torsdagsløpet
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:mt-4 sm:text-[17px]">
            Over 40 år med fellesskap, frisk luft og gode bein i Kalnesskogen.
            <span className="hidden sm:inline">
              {" "}
              Her er historien bak løpet — fra de første forsiktige stegene til
              en levende lokal tradisjon.
            </span>
          </p>
          {isAuthenticated && (
            <Button
              className="mt-5 gap-1.5"
              onClick={() => setShowAdd(true)}
              disabled={addMutation.isPending}
            >
              <PlusIcon className="size-4" />
              Legg til milepæl
            </Button>
          )}
        </section>

        <section className="mx-auto w-full max-w-6xl">
          <div className="relative">
            <div className="absolute top-1 bottom-1 left-3.5 w-0.5 -translate-x-1/2 bg-linear-to-b from-transparent via-border to-transparent sm:left-1/2" />
            {sortedMilestones.map((milestone, i) => {
              const Icon = getMilestoneIcon(milestone.icon);
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={milestone.uuid}
                  className={cn(
                    "relative sm:grid sm:grid-cols-[1fr_3rem_1fr] sm:items-center sm:gap-0",
                    i < sortedMilestones.length - 1 && "mb-4 sm:mb-6",
                  )}
                >
                  <div className="absolute left-0 top-0 z-10 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm sm:static sm:col-start-2 sm:row-start-1 sm:size-9 sm:justify-self-center sm:shadow-md sm:ring-[5px] sm:ring-background">
                    <Icon className="size-3.5 sm:size-4" />
                  </div>
                  <div
                    className={cn(
                      "pl-12 sm:row-start-1 sm:pl-0",
                      isLeft
                        ? "sm:col-start-1 sm:pr-3"
                        : "sm:col-start-3 sm:pl-3",
                    )}
                  >
                    <MilestoneCard
                      milestone={milestone}
                      onEdit={
                        isAuthenticated
                          ? () => setEditing(milestone)
                          : undefined
                      }
                    />
                  </div>
                  {milestone.extra && (
                    <div
                      className={cn(
                        "mt-4 pl-12 sm:row-start-1 sm:mt-0 sm:pl-0",
                        isLeft
                          ? "sm:col-start-3 sm:pl-3"
                          : "sm:col-start-1 sm:pr-3",
                      )}
                    >
                      <div className="rounded-2xl bg-brand-ink px-6 py-8 text-center">
                        <Quote className="mx-auto size-6 fill-brand text-brand" />
                        <blockquote className="mx-auto mt-3 max-w-[24ch] font-display text-base font-bold italic leading-snug tracking-tight text-white sm:text-lg">
                          {milestone.extra}
                        </blockquote>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Legg til milepæl</DialogTitle>
          </DialogHeader>
          <MilestoneForm
            initial={{}}
            submitLabel="Legg til"
            onCancel={() => setShowAdd(false)}
            onSubmit={(milestone) => addMutation.mutate(milestone)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editing}
        onOpenChange={(open) => {
          if (!open) setEditing(null);
        }}
      >
        <DialogContent className="max-h-[90dvh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Rediger milepæl</DialogTitle>
          </DialogHeader>
          {editing && (
            <MilestoneForm
              key={editing.uuid}
              initial={editing}
              submitLabel="Lagre"
              onCancel={() => setEditing(null)}
              onDelete={() => {
                setDeleting(editing);
                setEditing(null);
              }}
              onSubmit={(milestone) =>
                editMutation.mutate({ uuid: editing.uuid, milestone })
              }
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        {deleting && (
          <ConfirmDeleteDialog
            title="Slett milepæl"
            description={
              <>
                Er du sikker på at du vil slette{" "}
                <span className="font-semibold text-foreground">
                  {deleting.year} – {deleting.title}
                </span>
                ? Dette kan ikke angres.
              </>
            }
            isPending={deleteMutation.isPending}
            onConfirm={() => deleteMutation.mutate(deleting.uuid)}
            onClose={() => setDeleting(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
