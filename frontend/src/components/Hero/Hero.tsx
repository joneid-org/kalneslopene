import cardImage from "../../../public/hero.png";
import { NextRace } from "./NextRace.tsx";

export function Hero() {
  return (
    <>
      {/* Mobile: rounded hero card with the race card tucked underneath */}
      <div className="sm:hidden">
        <section className="relative h-[280px] mx-3 rounded-t-3xl overflow-hidden">
          <img
            src={cardImage}
            alt="Torsdagsløpet"
            className="absolute inset-0 w-full h-full object-cover object-[50%_28%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,58,40,0)_32%,rgba(15,30,20,0.55)_70%,rgba(15,30,20,0.82)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 p-4 text-center">
            <h1 className="font-display font-black text-white text-4xl leading-none tracking-[-0.03em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
              Torsdagsløpet
            </h1>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]">
              Lavterskel løpsglede siden 1978
            </p>
          </div>
        </section>
        <NextRace variant="stacked" />
      </div>

      {/* Desktop: full-bleed hero with the race card overlapping its base */}
      <section className="hidden sm:block relative overflow-hidden w-full h-[480px] max-h-[480px]">
        <img
          src={cardImage}
          alt="Torsdagsløpet"
          className="absolute inset-0 w-full h-full object-cover object-[50%_42%]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,58,40,0.18)_0%,rgba(18,58,40,0.28)_45%,rgba(15,30,20,0.72)_100%)]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pb-28">
          <h1 className="font-display font-black text-white text-7xl lg:text-[5.25rem] leading-[0.95] tracking-[-0.04em] drop-shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
            Torsdagsløpet
          </h1>
          <p className="mt-[18px] text-sm font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
            Lavterskel løpsglede siden 1978
          </p>
        </div>
        <NextRace variant="overlay" />
      </section>
    </>
  );
}
