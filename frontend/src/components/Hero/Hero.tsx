import cardImage from "../../data/hero.png";
import { NextRace } from "./NextRace.tsx";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden w-full h-[40vh] min-h-60"
      style={{ maxHeight: "800px" }}
    >
      <img
        src={cardImage}
        alt="Torsdagsløpet"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-linear-to-t from-[#123a28]/85 via-[#123a28]/10 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-r from-[#123a28]/25 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 lg:px-14 py-4 sm:pb-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center gap-6 sm:gap-8 mb-6 sm:mb-10 text-center">
          <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] tracking-tight leading-none">
            Torsdagsløpet
          </h1>
          <p className="text-xs font-bold uppercase tracking-widest text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
            Lavterskel løpsglede siden 1978
          </p>
          <NextRace />
        </div>
      </div>
    </section>
  );
}
