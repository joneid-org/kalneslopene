import { useQuery } from "@tanstack/react-query";
import { Heart, Mail, Phone } from "lucide-react";
import type { ComponentType, ReactNode } from "react";
import { Link } from "react-router";
import { QUERIES } from "@/api/queries.ts";
import { getContactPerson } from "@/lib/utils.ts";

const CURRENT_YEAR = new Date().getFullYear();

type IconProps = { className?: string };

function ContactLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: ComponentType<IconProps>;
  children: ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="inline-flex items-center gap-2 rounded-md border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
    >
      <Icon className="size-4 shrink-0 text-primary" />
      {children}
    </a>
  );
}

const FacebookIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
  </svg>
);

const MessengerIcon = ({ className }: IconProps) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M12 2C6.3 2 2 6.2 2 11.7c0 3.1 1.4 5.8 3.7 7.6V23l3.4-1.9c.9.3 1.9.4 2.9.4 5.7 0 10-4.2 10-9.7S17.7 2 12 2zm1 12.4l-2.5-2.7-4.9 2.7 5.4-5.7 2.6 2.7 4.8-2.7-5.4 5.7z" />
  </svg>
);

export default function HomeFooter() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  return (
    <footer className="bg-card border-t">
      <div className="footer-content py-10 sm:py-12 flex flex-col items-center text-center">
        <h2 className="font-display text-xl sm:text-2xl font-extrabold tracking-tight">
          Kontakt
        </h2>
        <p className="mt-2 text-muted-foreground">
          Har du spørsmål, innspill eller ønsker å bidra? Send oss en melding!
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-2.5">
          {mainContact?.email && (
            <ContactLink href={`mailto:${mainContact.email}`} icon={Mail}>
              E-post
            </ContactLink>
          )}
          {mainContact?.phone && (
            <ContactLink href={`tel:+47${mainContact.phone}`} icon={Phone}>
              Ring oss
            </ContactLink>
          )}
          <ContactLink
            href="https://www.facebook.com/torsdagslopet"
            icon={FacebookIcon}
          >
            Facebook
          </ContactLink>
          <ContactLink href="https://m.me/torsdagslopet" icon={MessengerIcon}>
            Messenger
          </ContactLink>
        </div>
      </div>

      <div className="border-t">
        <div className="footer-content py-4 flex flex-col items-center gap-1.5 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <span>© {CURRENT_YEAR} Torsdagsløpet</span>
          <span className="flex items-center gap-1.5">
            Drevet av frivillige
            <Heart className="size-3.5 fill-[#e0564f] text-[#e0564f]" />
            <span aria-hidden="true">·</span>
            <Link
              to="/admin"
              className="font-semibold hover:text-foreground transition-colors"
            >
              Admin
            </Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
