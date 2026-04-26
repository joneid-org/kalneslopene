import { Heart } from "lucide-react";
import xxlLogo from "@/data/7b914af91dd705b9e268e5fe80e7a87431e6d726-283x147.svg";
import kiwiLogo from "@/data/KIWI-LOGO.webp";

const sponsors = [
  { name: "Kiwi", url: "https://kiwi.no/", logo: kiwiLogo },
  { name: "XXL", url: "https://www.xxl.no/", logo: xxlLogo },
];

export default function SponsorsBlock() {
  return (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-4">
        <Heart className="size-4 text-primary" />
        <span className="text-base font-semibold">Sponsorer</span>
      </div>
      <div className="flex flex-wrap justify-center gap-8">
        {sponsors.map(({ name, url, logo }) => (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={name}
            className="flex items-center justify-center py-6 px-12 opacity-70 hover:opacity-100 transition-opacity"
          >
            <img src={logo} alt={name} className="h-50 w-auto object-contain" />
          </a>
        ))}
      </div>
    </div>
  );
}
