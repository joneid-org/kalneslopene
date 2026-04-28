import { useQuery } from "@tanstack/react-query";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { Separator } from "@/components/ui/separator.tsx";
import { getContactPerson } from "@/lib/utils.ts";

export default function HomeFooter() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  return (
    <footer className="bg-card border-t">
      <div className="page-content flex flex-col items-center gap-2">
        <h3 className=" font-semibold uppercase tracking-widest ">Kontakt</h3>
        <p>
          Har du spørsmål, innspill eller ønsker å bidra? Send oss en melding!
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <a
            href={`mailto:${mainContact?.email}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-muted/40 hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
          >
            <Mail className="size-3.5" />
            E-post
          </a>
          <a
            href={`tel:+47${mainContact?.phone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-muted/40 hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
          >
            <Phone className="size-3.5" />
            Ring oss
          </a>
          <a
            href="https://www.facebook.com/torsdagslopet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-muted/40 hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
            Facebook
          </a>
          <a
            href="https://m.me/torsdagslopet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-muted/40 hover:bg-muted transition-colors text-xs text-muted-foreground hover:text-foreground"
          >
            <MessageCircle className="size-3.5" />
            Messenger
          </a>
        </div>
      </div>

      <Separator />

      <div className="page-content py-2.5 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>© {new Date().getFullYear()} Torsdagsløpet</span>
        <div className="flex items-center gap-3">
          <span>Drevet av frivillige ❤️</span>
          <a
            href="/admin"
            className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
          >
            Admin
          </a>
        </div>
      </div>
    </footer>
  );
}
