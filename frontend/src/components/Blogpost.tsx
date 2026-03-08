import { CalendarIcon, CloudyIcon, MedalIcon, UsersIcon } from "lucide-react";
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
import cardImage from "../data/cardImage.jpg";

export default function Blogpost() {
  return (
    <Card className="w-[90%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%] flex flex-col my-[2vh]">
      <div className="relative">
        <img
          className="w-full h-[30vh] object-cover"
          alt="Løpsbilde"
          src={cardImage}
        />

        <div
          className="
        absolute top-3 left-3
        w-20 h-10
        bg-black/70 text-white
        flex items-center justify-center
        text-xs font-semibold uppercase
        rounded
        backdrop-blur-sm
      "
        >
          Løp 1
        </div>
      </div>
      <CardContent>
        <div className={"justify-between flex"}>
          <div className={"flex items-center"}>
            <CalendarIcon className="size-4" />
            <p className="font-extralight text-[10px] m-1">Torsdag 5 februar</p>
          </div>
          <div className={"flex items-center"}>
            <UsersIcon className="size-4" />
            <p className="font-extralight text-[10px] m-1">48 løpere</p>
          </div>
          <div className={"flex items-center"}>
            <CloudyIcon className="size-4" />
            <p className="font-extralight text-[10px] m-1">Nydelig vær</p>
          </div>
        </div>

        <p className="m-1 my-2 text-xs">
          Nok en seier av Sarah Johnson under rekord oppmøte!
        </p>

        <Card className="mt-3">
          <CardHeader className="pb-1 pt-3 px-3">
            <CardTitle className="text-xs flex items-center gap-1">
              <MedalIcon className="size-4 text-yellow-500" />
              Ukens vinnere
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-xs py-1.5">
                    Menn
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    Daniel Andersen
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5">
                    19:02
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium text-xs py-1.5">
                    Kvinner
                  </TableCell>
                  <TableCell className="text-xs py-1.5">
                    Elsa Skoglund
                  </TableCell>
                  <TableCell className="text-right font-mono text-xs py-1.5">
                    24:10
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>

      <div className="flex justify-center mb-2 mx-3">
        <Button className="w-[98%]">Se ukens resultater og bilder</Button>
      </div>
    </Card>
  );
}
