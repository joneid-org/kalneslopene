import { CalendarIcon, CloudyIcon, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import cardImage from "../data/cardImage.jpg";

export default function Blogpost() {
  return (
    <Card className="w-[90%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%] flex flex-col my-[2vh]">
      <div className="relative">
        <img
          className="w-full h-[30vh] object-cover"
          aria-label={"image"}
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
            <p className="font-extralight text-xs m-1">Torsdag 5 februar</p>
          </div>
          <div className={"flex items-center"}>
            <UsersIcon className="size-4" />
            <p className="font-extralight text-xs m-1">48 løpere</p>
          </div>
          <div className={"flex items-center"}>
            <CloudyIcon className="size-4" />
            <p className="font-extralight text-xs m-1">Nydelig vær</p>
          </div>
        </div>

        <p className="m-1 my-2">
          Nok en seier av Sarah Johnson under rekord oppmøte!
        </p>

        <div className="border border-gray-300 rounded-xl p-2">
          <p>Ukens vinnere</p>
          <div className="flex flex-col sm:flex-row my-2">
            <div className="flex-1">
              <p className="font-light">Men&apos;s</p>
              <p>Daniel Andersen</p>
              <p>19:02</p>
            </div>

            <div className="flex-1">
              <p className="font-light">Women&apos;s</p>
              <p>Elsa Skoglund</p>
              <p>24:10</p>
            </div>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-center mb-2">
        <Button className="w-[98%]">Se ukens resultater og bilder</Button>
      </div>
    </Card>
  );
}
