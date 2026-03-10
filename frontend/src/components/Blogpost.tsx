import { CalendarIcon, CloudyIcon, MedalIcon, UsersIcon } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table.tsx";
import { getLatestRace } from "@/data/mockdata.ts";
import cardImage from "../data/cardImage.jpg";

export default function Blogpost() {
  const latestRace = getLatestRace();
  const resultaterPath = `/Resultater/${new Date(latestRace.date).getFullYear()}/${latestRace.week}`;

  return (
    <Card className="relative w-full sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[55%] flex flex-col my-2 pt-0 overflow-hidden">
      <img
        className="relative z-20 w-full h-48 sm:h-56 object-cover"
        alt="Løpsbilde"
        src={cardImage}
      />
      <div className="absolute top-3 left-3 z-30 px-2.5 py-1 bg-black/60 text-white text-xs font-semibold rounded backdrop-blur-sm">
        Løp 1
      </div>

      <CardHeader>
        {/* Meta row */}
        <div className="flex justify-between text-muted-foreground">
          <span className="flex items-center gap-1.5 text-xs">
            <CalendarIcon className="size-3.5 shrink-0" />
            Torsdag 5 februar
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <UsersIcon className="size-3.5 shrink-0" />
            48 løpere
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <CloudyIcon className="size-3.5 shrink-0" />
            Nydelig vær
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-2 space-y-3">
        {/* Intro */}
        <p className="text-base">
          Nok en seier av Sarah Johnson under rekord oppmøte!
        </p>

        {/* Winners card */}
        <Card className="bg-muted/5">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-base flex items-center gap-1.5">
              <MedalIcon className="size-4 text-amber-500" />
              Ukens vinnere
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="text-sm py-1.5 font-medium w-16">
                    Menn
                  </TableCell>
                  <TableCell className="text-sm py-1.5">
                    Daniel Andersen
                  </TableCell>
                  <TableCell className="text-right text-sm py-1.5 tabular-nums font-mono">
                    19:02
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="text-sm py-1.5 font-medium w-16">
                    Kvinner
                  </TableCell>
                  <TableCell className="text-sm py-1.5">
                    Elsa Skoglund
                  </TableCell>
                  <TableCell className="text-right text-sm py-1.5 tabular-nums font-mono">
                    24:10
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>

      <div className="px-6 pb-5">
        <Button asChild className="w-full">
          <Link to={resultaterPath}>Se ukens resultater og bilder</Link>
        </Button>
      </div>
    </Card>
  );
}
