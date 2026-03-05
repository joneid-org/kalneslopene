import { Button } from "@/components/ui/button.tsx";
import { Card, CardContent } from "@/components/ui/card.tsx";
import cardImage from "../data/cardImage.jpg";

export default function Blogpost() {
  return (
    <Card className="w-[90%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[50%] flex flex-col my-[2vh]">
      <div className="relative">
        <img className="h-[30vh]" aria-label={"image"} src={cardImage} />

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
        <p className="font-extralight text-xs m-1">
          Torsdag 5 februar, 48 løpere, nydelig vær
        </p>
        <p className="m-1 my-2">
          Nok en seier av Sarah Johnson under rekord oppmøte!
        </p>
        <div className="border border-gray-300 rounded-xl p-2">
          <p>Ukens vinnere</p>
          <div className="flex flex-col sm:flex-row gap-4">
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
