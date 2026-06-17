import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/ui/button.tsx";

export function Slogan() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 rounded-2xl border sm:border-0 bg-card sm:bg-primary p-5 sm:p-7 text-center sm:text-left shadow-sm sm:shadow-[0_20px_40px_-24px_rgba(18,58,40,0.6)]">
      <div className="flex-1">
        <h2 className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-foreground sm:text-white mb-2 sm:mb-1.5">
          <span className="sm:hidden">Snør på deg skoene</span>
          <span className="hidden sm:inline">
            Snør på deg skoene — bli med i torsdagsløpet!
          </span>
        </h2>
        <p className="text-sm text-muted-foreground sm:text-white/80 leading-relaxed sm:max-w-[62ch]">
          Ingen forhåndspåmelding — skriv deg på deltakerlista før start. Gratis
          frukt til alle deltakere etter løpet 🍎
        </p>
      </div>
      <Button
        asChild
        className="shrink-0 w-full sm:w-auto h-12 sm:h-[52px] px-6 rounded-2xl bg-primary sm:bg-brand text-primary-foreground sm:text-brand-foreground hover:bg-primary/90 sm:hover:bg-brand/90 font-extrabold text-[15px]"
      >
        <Link to="/Løpskalender">
          Åpne løpskalender
          <ArrowRight />
        </Link>
      </Button>
    </div>
  );
}
