import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  XCircleIcon,
  XIcon,
} from "lucide-react";
import { useState } from "react";
import { QUERIES } from "@/api/queries.ts";
import { Badge } from "@/components/ui/badge.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { formatSecondsToTime, timeToSeconds } from "@/lib/timeUtils.ts";
import type { RunnerDTO } from "@/model/DTO.ts";

export type CsvRow = {
  id: number;
  csvName: string;
  timeSeconds: number;
  timeRaw: string;
  resolvedRunner: RunnerDTO | null;
};

type EditMode = "time" | "link" | "create" | null;

function RowEditor({
  row,
  onUpdate,
  onClose,
}: {
  row: CsvRow;
  onUpdate: (updated: Partial<CsvRow>) => void;
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [mode, setMode] = useState<EditMode>(null);

  // Time editing
  const [time, setTime] = useState(formatSecondsToTime(row.timeSeconds));

  // Runner linking
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useQuery({
    ...QUERIES.runner.getAllRunners(searchQuery),
    enabled: searchQuery.length > 1,
    staleTime: 0,
    gcTime: 0,
  });

  // Runner creation
  const [newName, setNewName] = useState(row.csvName);
  const [newGender, setNewGender] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      QUERIES.runner
        .createRunners([{ name: newName.trim(), gender: newGender }])
        .queryFn(),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ["runner"] });
      onUpdate({ resolvedRunner: created[0] });
      onClose();
    },
  });

  if (mode === "time") {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        <Input
          className="h-7 w-28 text-xs px-2"
          placeholder="mm:ss"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          autoFocus
        />
        <Button
          size="sm"
          className="h-7 gap-1 text-xs px-2"
          disabled={!time}
          onClick={() => {
            onUpdate({ timeSeconds: timeToSeconds(time), timeRaw: time });
            setMode(null);
          }}
        >
          <CheckIcon className="size-3" />
          OK
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-7 w-7 p-0"
          onClick={() => setMode(null)}
        >
          <XIcon className="size-3.5" />
        </Button>
      </div>
    );
  }

  if (mode === "link") {
    return (
      <div className="space-y-2 py-1">
        <div className="flex items-center gap-2">
          <SearchIcon className="size-3.5 text-muted-foreground shrink-0" />
          <Input
            className="h-7 text-xs px-2"
            placeholder="Søk løper..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => setMode(null)}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
        {searchResults && searchResults.length > 0 && (
          <div className="border rounded-md divide-y max-h-32 overflow-y-auto">
            {searchResults.map((r) => (
              <button
                key={r.uuid}
                type="button"
                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted flex items-center justify-between"
                onClick={() => {
                  onUpdate({ resolvedRunner: r });
                  setMode(null);
                }}
              >
                <span>{r.name}</span>
                <span className="text-muted-foreground">{r.gender}</span>
              </button>
            ))}
          </div>
        )}
        {searchQuery.length > 1 &&
          (!searchResults || searchResults.length === 0) && (
            <p className="text-xs text-muted-foreground px-1">Ingen treff.</p>
          )}
      </div>
    );
  }

  if (mode === "create") {
    return (
      <div className="space-y-2 py-1">
        <div className="space-y-1">
          <Label className="text-xs">Navn</Label>
          <Input
            className="h-7 text-xs px-2"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            autoFocus
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Kjønn</Label>
          <div className="flex gap-2">
            {["Mann", "Kvinne"].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setNewGender(g)}
                className={`flex-1 rounded border px-2 py-1 text-xs transition-colors ${
                  newGender === g
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:bg-muted"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="h-7 gap-1 text-xs px-2 flex-1"
            disabled={!newName.trim() || !newGender || createMutation.isPending}
            onClick={() => createMutation.mutate()}
          >
            <PlusIcon className="size-3" />
            {createMutation.isPending ? "Oppretter..." : "Opprett løper"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 shrink-0"
            onClick={() => setMode(null)}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
        {createMutation.isError && (
          <p className="text-xs text-destructive">Kunne ikke opprette løper.</p>
        )}
      </div>
    );
  }

  // Default: action buttons
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <Button
        size="sm"
        variant="ghost"
        className="h-6 gap-1 text-xs px-2 text-muted-foreground"
        onClick={() => setMode("time")}
        title="Endre tid"
      >
        <PencilIcon className="size-3" />
        Tid
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 gap-1 text-xs px-2 text-muted-foreground"
        onClick={() => setMode("link")}
        title="Koble til løper"
      >
        <SearchIcon className="size-3" />
        Koble
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 gap-1 text-xs px-2 text-muted-foreground"
        onClick={() => setMode("create")}
        title="Opprett ny løper"
      >
        <PlusIcon className="size-3" />
        Ny
      </Button>
      <Button
        size="sm"
        variant="ghost"
        className="h-6 w-6 p-0 text-destructive/70 hover:text-destructive"
        onClick={onClose}
        title="Lukk"
      >
        <XIcon className="size-3.5" />
      </Button>
    </div>
  );
}

export function CsvReviewTable({
  rows,
  onRowsChange,
}: {
  rows: CsvRow[];
  onRowsChange: (rows: CsvRow[]) => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);

  function updateRow(id: number, partial: Partial<CsvRow>) {
    onRowsChange(rows.map((r) => (r.id === id ? { ...r, ...partial } : r)));
  }

  function removeRow(id: number) {
    onRowsChange(rows.filter((r) => r.id !== id));
  }

  const resolved = rows.filter((r) => r.resolvedRunner !== null).length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{resolved}</span> av{" "}
          {rows.length} løpere koblet
        </p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckIcon className="size-3 text-green-500" />
            Funnet
          </span>
          <span className="flex items-center gap-1">
            <XCircleIcon className="size-3 text-orange-500" />
            Ikke funnet
          </span>
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8">#</TableHead>
              <TableHead>Navn i fil</TableHead>
              <TableHead>Løper</TableHead>
              <TableHead className="w-24">Tid</TableHead>
              <TableHead className="w-8" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, idx) => {
              const isEditing = editingId === row.id;
              return (
                <TableRow
                  key={row.id}
                  className={
                    !row.resolvedRunner
                      ? "bg-orange-50 dark:bg-orange-950/20"
                      : undefined
                  }
                >
                  <TableCell className="text-muted-foreground text-xs">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {row.csvName}
                  </TableCell>
                  <TableCell>
                    {isEditing ? (
                      <RowEditor
                        row={row}
                        onUpdate={(p) => updateRow(row.id, p)}
                        onClose={() => setEditingId(null)}
                      />
                    ) : row.resolvedRunner ? (
                      <div className="flex items-center gap-2">
                        <CheckIcon className="size-3.5 text-green-500 shrink-0" />
                        <span className="text-sm">
                          {row.resolvedRunner.name}
                        </span>
                        {row.resolvedRunner.name !== row.csvName && (
                          <Badge
                            variant="outline"
                            className="text-xs py-0 px-1.5"
                          >
                            koblet
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <XCircleIcon className="size-3.5 text-orange-500 shrink-0" />
                        <span className="text-sm text-muted-foreground italic">
                          Ikke funnet
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="tabular-nums font-mono text-sm">
                    {row.timeSeconds > 0
                      ? formatSecondsToTime(row.timeSeconds)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {!isEditing && (
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
                          onClick={() => setEditingId(row.id)}
                        >
                          <PencilIcon className="size-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 w-6 p-0 text-destructive/60 hover:text-destructive"
                          onClick={() => removeRow(row.id)}
                        >
                          <XIcon className="size-3.5" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
