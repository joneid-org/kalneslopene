import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator.tsx";

const sponsors = [
  { name: "Grimsgaard Sport", url: "#" },
  { name: "Kalneset IF", url: "#" },
  { name: "Løpernes Venner AS", url: "#" },
];

const quickLinks = [
  { label: "Resultater", path: "/Resultater" },
  { label: "Bilder", path: "/Bilder" },
  { label: "Løpskalender", path: "/Lopskalender" },
  { label: "Statistikk", path: "/Statistikk" },
  { label: "Styret", path: "/Styret" },
];

export default function HomeFooter() {
  return (
    <footer className="bg-card border-t mt-10">
      <div className="px-4 py-8 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Contact */}
          <div className="space-y-3">
            <h3 className="font-semibold">Kontakt</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Mail className="size-3.5 shrink-0" />
                <a
                  href="mailto:kontakt@torsdagslop.no"
                  className="hover:text-foreground transition-colors"
                >
                  kontakt@torsdagslop.no
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-3.5 shrink-0" />
                <span>+47 000 00 000</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="size-3.5 shrink-0 mt-0.5" />
                <span>Kalneset, Grimstad</span>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h3 className="font-semibold">Snarveier</h3>
            <ul className="space-y-1.5">
              {quickLinks.map(({ label, path }) => (
                <li key={path}>
                  <Link
                    to={path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sponsors */}
          <div className="space-y-3">
            <h3 className="font-semibold">Sponsorer</h3>
            <ul className="space-y-2">
              {sponsors.map(({ name, url }) => (
                <li key={name}>
                  <a
                    href={url}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">
              Ønsker du å bli sponsor?{" "}
              <a
                href="mailto:kontakt@torsdagslop.no"
                className="underline hover:text-foreground transition-colors"
              >
                Ta kontakt
              </a>
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        <p className="text-xs text-center text-muted-foreground">
          © {new Date().getFullYear()} Torsdagsløpet · Drevet av frivillige
        </p>
      </div>
    </footer>
  );
}
