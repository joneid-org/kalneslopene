import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.tsx";
import { results } from "../data/mockdata.ts";

const DISTANCE_KM = 5; // TODO: set this to your actual race distance

function parseTimeToSeconds(time: string): number {
  // supports "mm:ss" (and also "hh:mm:ss" if you ever add it)
  const parts = time.split(":").map((p) => Number(p));
  if (parts.some((n) => Number.isNaN(n))) return Number.POSITIVE_INFINITY;

  if (parts.length === 2) {
    const [mm, ss] = parts;
    return mm * 60 + ss;
  }
  if (parts.length === 3) {
    const [hh, mm, ss] = parts;
    return hh * 3600 + mm * 60 + ss;
  }
  return Number.POSITIVE_INFINITY;
}

function formatSecondsToTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds)) return "-";
  const rounded = Math.round(totalSeconds);
  const mm = Math.floor(rounded / 60);
  const ss = rounded % 60;
  return `${mm}:${String(ss).padStart(2, "0")}`;
}

export default function Results() {
  const byRunner = results.reduce<
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

    const existing = acc[key];
    if (!existing) {
      acc[key] = {
        races: 1,
        personalBestSeconds: t,
        bestThisYearSeconds: t, // NOTE: no dates/years in data yet, so "year" = all data
      };
      return acc;
    }

    existing.races += 1;
    existing.personalBestSeconds = Math.min(existing.personalBestSeconds, t);
    existing.bestThisYearSeconds = Math.min(existing.bestThisYearSeconds, t);

    return acc;
  }, {});

  return (
    <Card className="mb-8 w-[80%]">
      <CardHeader>
        <CardHeader>Full Results</CardHeader>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-20">#</TableHead>
              <TableHead>Navn</TableHead>
              <TableHead>Resultat</TableHead>
              <TableHead>Antall løp</TableHead>
              <TableHead>Tid per km</TableHead>
              <TableHead>Kjønn</TableHead>
              <TableHead>Personlig rekord</TableHead>
              <TableHead>Årsbeste</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {results.map((result) => {
              const stats = byRunner[result.runnerId];
              const timeSeconds = parseTimeToSeconds(result.time);

              const paceSecondsPerKm =
                DISTANCE_KM > 0 ? timeSeconds / DISTANCE_KM : Number.NaN;

              return (
                <TableRow key={result.id}>
                  <TableCell>#{result.position}</TableCell>
                  <TableCell>{result.runnerName}</TableCell>
                  <TableCell>{result.time}</TableCell>

                  <TableCell>{stats?.races ?? "-"}</TableCell>
                  <TableCell>{formatSecondsToTime(paceSecondsPerKm)}</TableCell>
                  <TableCell>{result.gender}</TableCell>

                  <TableCell>
                    {stats
                      ? formatSecondsToTime(stats.personalBestSeconds)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {stats
                      ? formatSecondsToTime(stats.bestThisYearSeconds)
                      : "-"}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
