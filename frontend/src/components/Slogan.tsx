import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

export function Slogan() {
  return (
    <div className="border-l-4 shadow-2xl pt-5 pb-2 border-[#2f7d4c] text-center space-y-2">
      <p className="text-2xl rounded-2xl sm:text-xl mx-3 font-black bg-[#2f7d4c] text-white tracking-tight p-2">
        Snør på deg skoene - bli med i Torsdagsløpet!
      </p>
      <p className="text-sm font-bold max-w-xl mx-auto">
        Ingen forhåndspåmelding - du trenger kun å skrive deg på vår
        deltakerliste før start. Gratis frukt til alle deltakere etter løpet
        🍎🏃
      </p>
      <Button variant={"outline"}>
        Åpne løpskalender
        <ArrowRight />
      </Button>
    </div>
  );
}
