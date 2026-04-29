import xxlLogo from "@/data/7b914af91dd705b9e268e5fe80e7a87431e6d726-283x147.svg";
import kiwiLogo from "@/data/kiwi-logo-white-outl-wo-pay-off.png";

const sponsors = [
  { name: "Kiwi", url: "https://kiwi.no/", logo: kiwiLogo },
  { name: "XXL", url: "https://www.xxl.no/", logo: xxlLogo },
];

export default function SponsorsBlock() {
  return (
    <div className="py-4">
      <div className="flex  gap-2 mb-4  justify-center">
        <span className="text-base font-semibold">Våre sponsorer</span>
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
            <img src={logo} alt={name} className="h-15" />
          </a>
        ))}
      </div>
    </div>
  );
}
