import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  CloudIcon,
  Images,
  MapPinIcon,
  SlidersHorizontal,
  TimerIcon,
  TrophyIcon,
  UsersIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel.tsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import type { Photo, Result } from "../data/mockdata.ts";
import { getRacesByYear, photos, races, results } from "../data/mockdata.ts";

const DISTANCE_KM = 5;

function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return Number.POSITIVE_INFINITY;
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return Number.POSITIVE_INFINITY;
}

function formatSecondsToTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "-";
  const rounded = Math.round(totalSeconds);
  const mm = Math.floor(rounded / 60);
  const ss = rounded % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

const COLUMN_LABELS: Record<string, string> = {
  position: "#",
  runnerName: "Navn",
  time: "Resultat",
  gender: "Kjønn",
  races: "Løp",
  pace: "min/km",
  pr: "PR",
  yearBest: "Årsbeste",
};

// Columns hidden on mobile, visible on md+
const DESKTOP_ONLY_COLUMNS = ["gender", "races", "pace", "pr", "yearBest"];

type RowData = Result & {
  races: number;
  pace: string;
  pr: string;
  yearBest: string;
};

type Props = {
  year?: number;
  week?: number;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export default function Results({ year, week }: Props) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Responsive default visibility
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () =>
      Object.fromEntries(
        DESKTOP_ONLY_COLUMNS.map((c) => [c, window.innerWidth >= 768]),
      ),
  );

  // Keep visibility in sync when screen size changes
  useEffect(() => {
    setColumnVisibility((prev) => {
      const updated = { ...prev };
      for (const col of DESKTOP_ONLY_COLUMNS) {
        // Only auto-update columns that are still at their "default" state
        updated[col] = !isMobile;
      }
      return updated;
    });
  }, [isMobile]);

  // All races sorted oldest → newest (for prev/next)
  const sortedRaces = useMemo(
    () =>
      [...races].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [],
  );

  const race = useMemo(() => {
    if (!year || !week) return null;
    return getRacesByYear(year).find((r) => r.week === week) ?? null;
  }, [year, week]);

  const currentIndex = useMemo(
    () => (race ? sortedRaces.findIndex((r) => r.id === race.id) : -1),
    [race, sortedRaces],
  );

  const prevRace = currentIndex > 0 ? sortedRaces[currentIndex - 1] : null;
  const nextRace =
    currentIndex !== -1 && currentIndex < sortedRaces.length - 1
      ? sortedRaces[currentIndex + 1]
      : null;

  function raceToPath(r: (typeof races)[number]) {
    const y = new Date(r.date).getFullYear();
    return `/Resultater/${y}/${r.week}`;
  }

  // Per-runner stats
  const byRunner = useMemo(
    () =>
      results.reduce<
        Record<
          string,
          {
            races: number;
            personalBestSeconds: number;
            bestThisYearSeconds: number;
          }
        >
      >((acc, r) => {
        const key = r.runnerId;
        const t = parseTimeToSeconds(r.time);
        if (!acc[key]) {
          acc[key] = {
            races: 1,
            personalBestSeconds: t,
            bestThisYearSeconds: t,
          };
          return acc;
        }
        acc[key].races += 1;
        acc[key].personalBestSeconds = Math.min(
          acc[key].personalBestSeconds,
          t,
        );
        acc[key].bestThisYearSeconds = Math.min(
          acc[key].bestThisYearSeconds,
          t,
        );
        return acc;
      }, {}),
    [],
  );

  const tableData: RowData[] = useMemo(() => {
    const filtered = race
      ? results
          .filter((r) => r.raceId === race.id)
          .sort((a, b) => {
            if (a.gender !== b.gender) return a.gender === "M" ? -1 : 1;
            return a.position - b.position;
          })
      : results;

    return filtered.map((r) => {
      const stats = byRunner[r.runnerId];
      const timeSeconds = parseTimeToSeconds(r.time);
      const paceSeconds =
        DISTANCE_KM > 0 ? timeSeconds / DISTANCE_KM : Number.NaN;
      return {
        ...r,
        races: stats?.races ?? 0,
        pace: formatSecondsToTime(paceSeconds),
        pr: stats ? formatSecondsToTime(stats.personalBestSeconds) : "-",
        yearBest: stats ? formatSecondsToTime(stats.bestThisYearSeconds) : "-",
      };
    });
  }, [race, byRunner]);

  // Fastest M and F
  const fastestM = useMemo(
    () =>
      tableData
        .filter((r) => r.gender === "M")
        .sort(
          (a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time),
        )[0],
    [tableData],
  );
  const fastestF = useMemo(
    () =>
      tableData
        .filter((r) => r.gender === "F")
        .sort(
          (a, b) => parseTimeToSeconds(a.time) - parseTimeToSeconds(b.time),
        )[0],
    [tableData],
  );

  const racePhotos: Photo[] = useMemo(
    () => (race ? photos.filter((p) => p.raceId === race.id) : []),
    [race],
  );

  const columns: ColumnDef<RowData>[] = useMemo(
    () => [
      {
        accessorKey: "position",
        header: "#",
        cell: ({ getValue }) => (
          <span className="font-medium">{getValue<number>()}</span>
        ),
        size: 36,
      },
      {
        accessorKey: "runnerName",
        header: "Navn",
        cell: ({ getValue }) => (
          <span className="block truncate max-w-[130px]">
            {getValue<string>()}
          </span>
        ),
      },
      {
        accessorKey: "time",
        header: "Resultat",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "gender",
        header: "Kjønn",
        cell: ({ getValue }) => (
          <span className="text-muted-foreground">
            {getValue<string>() === "M" ? "M" : "K"}
          </span>
        ),
        size: 44,
      },
      {
        accessorKey: "races",
        header: "Løp",
        size: 44,
      },
      {
        accessorKey: "pace",
        header: "min/km",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "pr",
        header: "PR",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
      {
        accessorKey: "yearBest",
        header: "Årsbeste",
        cell: ({ getValue }) => (
          <span className="tabular-nums">{getValue<string>()}</span>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: { columnVisibility },
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
  });

  const title = race
    ? `Uke ${race.week} — ${new Date(race.date).toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" })}`
    : "Alle resultater";

  return (
    <div className="w-full max-w-2xl md:max-w-4xl space-y-3 md:space-y-5">
      {/* ── Prev / Next navigation ── */}
      <div className="flex justify-between items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-xs md:text-sm gap-1 px-2 md:px-3 md:h-9"
          disabled={!prevRace}
          onClick={() => prevRace && navigate(raceToPath(prevRace))}
        >
          <ChevronLeft className="size-3.5 md:size-4" />
          {prevRace
            ? `Uke ${prevRace.week}, ${new Date(prevRace.date).getFullYear()}`
            : "Første løp"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-xs md:text-sm gap-1 px-2 md:px-3 md:h-9"
          disabled={!nextRace}
          onClick={() => nextRace && navigate(raceToPath(nextRace))}
        >
          {nextRace
            ? `Uke ${nextRace.week}, ${new Date(nextRace.date).getFullYear()}`
            : "Siste løp"}
          <ChevronRight className="size-3.5 md:size-4" />
        </Button>
      </div>

      {/* ── Hero image ── */}
      {race && (
        <div className="relative w-full rounded-xl overflow-hidden shadow-sm">
          <img
            src={race.imageUrl}
            alt={title}
            className="w-full h-44 sm:h-64 md:h-80 object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Week badge */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-black/60 text-white text-xs md:text-sm font-semibold px-2.5 py-1 md:px-3 md:py-1.5 rounded backdrop-blur-sm">
            Uke {race.week}
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 md:px-5 md:pb-5 text-white">
            <p className="text-sm md:text-lg font-semibold leading-snug">
              {new Date(race.date).toLocaleDateString("nb-NO", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <div className="flex flex-wrap gap-x-3 mt-1 text-xs md:text-sm text-white/80">
              <span className="flex items-center gap-1">
                <MapPinIcon className="size-3 md:size-3.5" />
                {race.location}
              </span>
              {race.weatherConditions && (
                <span className="flex items-center gap-1">
                  <CloudIcon className="size-3 md:size-3.5" />
                  {race.weatherConditions}
                </span>
              )}
            </div>
            {race.highlights && (
              <p className="text-xs md:text-sm text-white/70 mt-1 line-clamp-2">
                {race.highlights}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Stat boxes ── */}
      {race && (
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {/* Distance */}
          <div className="rounded-xl bg-blue-50 border border-blue-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
            <div className="bg-blue-100 rounded-full p-1.5 md:p-2.5">
              <MapPinIcon className="size-4 md:size-6 text-blue-600" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-blue-700 tabular-nums leading-none">
              {race.distance}
            </p>
            <p className="text-[10px] md:text-xs text-blue-500 font-medium uppercase tracking-wide">
              Distanse
            </p>
          </div>

          {/* Participants */}
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
            <div className="bg-emerald-100 rounded-full p-1.5 md:p-2.5">
              <UsersIcon className="size-4 md:size-6 text-emerald-600" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-emerald-700 tabular-nums leading-none">
              {race.participants}
            </p>
            <p className="text-[10px] md:text-xs text-emerald-500 font-medium uppercase tracking-wide">
              Deltakere
            </p>
          </div>

          {/* Fastest time */}
          <div className="rounded-xl bg-amber-50 border border-amber-100 flex flex-col items-center justify-center py-3 md:py-5 px-2 md:px-4 gap-1 md:gap-2">
            <div className="bg-amber-100 rounded-full p-1.5 md:p-2.5">
              <TrophyIcon className="size-4 md:size-6 text-amber-600" />
            </div>
            <p className="text-base sm:text-lg md:text-2xl font-bold text-amber-700 tabular-nums leading-none">
              {fastestM?.time ?? "-"}
            </p>
            <p className="text-[10px] md:text-xs text-amber-500 font-medium uppercase tracking-wide">
              Raskest
            </p>
          </div>
        </div>
      )}

      {/* ── Winners summary ── */}
      {race && (fastestM || fastestF) && (
        <Card>
          <CardContent className="py-3 md:py-5 px-4 md:px-6">
            <p className="text-xs md:text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-2 md:mb-3">
              Ukens vinnere
            </p>
            <div className="grid grid-cols-2 gap-3 md:gap-6">
              {fastestM && (
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-blue-100 rounded-full p-1.5 md:p-2.5 shrink-0">
                    <TimerIcon className="size-3.5 md:size-5 text-blue-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Menn
                    </p>
                    <p className="text-xs md:text-base font-semibold truncate">
                      {fastestM.runnerName}
                    </p>
                    <p className="text-xs md:text-sm tabular-nums text-muted-foreground">
                      {fastestM.time}
                    </p>
                  </div>
                </div>
              )}
              {fastestF && (
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="bg-pink-100 rounded-full p-1.5 md:p-2.5 shrink-0">
                    <TimerIcon className="size-3.5 md:size-5 text-pink-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-muted-foreground">
                      Kvinner
                    </p>
                    <p className="text-xs md:text-base font-semibold truncate">
                      {fastestF.runnerName}
                    </p>
                    <p className="text-xs md:text-sm tabular-nums text-muted-foreground">
                      {fastestF.time}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Data table ── */}
      <Card>
        <CardHeader className="py-3 md:py-4 px-4 md:px-6 pb-0">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-sm md:text-base font-semibold leading-tight">
              {title}
            </CardTitle>
            <div className="flex items-center gap-1">
              {race && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs md:text-sm gap-1 h-7 md:h-9 md:px-3"
                  onClick={() => navigate(`/Bilder/${year}/${week}`)}
                >
                  <Images className="size-3.5 md:size-4" />
                  Bilder
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 h-7 md:h-9 md:px-3"
                  >
                    <SlidersHorizontal className="size-3.5 md:size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuLabel className="text-xs">
                    Vis kolonner
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="text-xs"
                        checked={col.getIsVisible()}
                        onCheckedChange={(val) => col.toggleVisibility(val)}
                      >
                        {COLUMN_LABELS[col.id] ?? col.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 mt-2">
          <div className="overflow-x-auto">
            <Table className="text-xs sm:text-sm md:text-base">
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        className="px-2 md:px-4 py-2 md:py-3 whitespace-nowrap"
                        style={
                          header.column.columnDef.size
                            ? { width: header.column.columnDef.size }
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-2 md:px-4 py-1.5 md:py-2.5"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* ── Photo carousel ── */}
      {racePhotos.length > 0 && (
        <Card>
          <CardHeader className="py-3 md:py-4 px-4 md:px-6 pb-1">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm md:text-base font-semibold">
                Bilder
              </CardTitle>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs md:text-sm gap-1 h-7 md:h-9"
                onClick={() => navigate(`/Bilder/${year}/${week}`)}
              >
                Se alle
                <ChevronRight className="size-3.5 md:size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="py-2 px-2 sm:px-4 md:px-6">
            <Carousel className="w-full" opts={{ align: "start" }}>
              <CarouselContent className="-ml-2">
                {racePhotos.map((photo, idx) => (
                  <CarouselItem
                    key={photo.id}
                    className="pl-2 basis-1/2 sm:basis-1/3 md:basis-1/4"
                  >
                    <button
                      type="button"
                      className="w-full aspect-square overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      onClick={() => setLightboxIndex(idx)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.caption}
                        className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                      />
                    </button>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {racePhotos.length > 2 && (
                <>
                  <CarouselPrevious className="left-1" />
                  <CarouselNext className="right-1" />
                </>
              )}
            </Carousel>
          </CardContent>
        </Card>
      )}

      {/* ── Lightbox ── */}
      <Dialog
        open={lightboxIndex !== null}
        onOpenChange={(open) => !open && setLightboxIndex(null)}
      >
        <DialogContent className="max-w-screen-sm p-2 sm:p-4 bg-black border-0">
          <DialogTitle className="sr-only">
            Bilde {(lightboxIndex ?? 0) + 1} av {racePhotos.length}
          </DialogTitle>
          {lightboxIndex !== null && (
            <div className="relative">
              <img
                src={racePhotos[lightboxIndex].url}
                alt={racePhotos[lightboxIndex].caption}
                className="w-full rounded-md object-contain max-h-[80vh]"
              />
              {racePhotos[lightboxIndex].caption && (
                <p className="text-center text-xs text-white/70 mt-2">
                  {racePhotos[lightboxIndex].caption}
                </p>
              )}
              <div className="absolute inset-y-0 left-0 flex items-center">
                <button
                  type="button"
                  className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                  disabled={lightboxIndex === 0}
                  onClick={() =>
                    setLightboxIndex((i) => (i !== null ? i - 1 : null))
                  }
                >
                  <ChevronLeft className="size-7" />
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center">
                <button
                  type="button"
                  className="p-1 text-white/70 hover:text-white disabled:opacity-20"
                  disabled={lightboxIndex === racePhotos.length - 1}
                  onClick={() =>
                    setLightboxIndex((i) => (i !== null ? i + 1 : null))
                  }
                >
                  <ChevronRight className="size-7" />
                </button>
              </div>
              <p className="absolute bottom-6 inset-x-0 text-center text-xs text-white/50">
                {lightboxIndex + 1} / {racePhotos.length}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
