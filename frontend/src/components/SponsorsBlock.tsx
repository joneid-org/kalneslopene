import kiwiLogo from "../../public/kiwi.png";
import sa from "../../public/sa.svg";
import xxlLogo from "../../public/xxl.svg";

const sponsors = [
  { name: "Kiwi", url: "https://kiwi.no/", logo: kiwiLogo },
  { name: "XXL", url: "https://www.xxl.no/", logo: xxlLogo },
  { name: "Sa", url: "https://www.sa.no/", logo: sa },
];

export default function SponsorsBlock() {
  return (
    <div className="py-2 text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground mb-4">
        Våre sponsorer
      </p>
      <div className="flex flex-wrap items-center justify-center gap-x-10 sm:gap-x-14 gap-y-6 rounded-2xl border bg-card p-5 sm:p-8">
        {sponsors.map(({ name, url, logo }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={name}
            className="flex items-center justify-center hover:opacity-70 transition-opacity"
          >
            <img src={logo} alt={name} className="h-8 sm:h-10 object-contain" />
          </a>
        ))}
      </div>
    </div>
  );
}
