import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { getContactPerson } from "@/lib/utils.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  return (
    <section className="space-y-6 pb-4">
      <p className="text-sm text-gray-500 leading-relaxed max-w-prose">
        Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert
        ukentlige løp siden 1978. Vi er en gjeng entusiaster som brenner for
        løping og fellesskap.
      </p>

      {/* Team grid — minimal, avatar-focused */}
      {organizers && organizers.length > 0 && (
        <div className="flex flex-wrap gap-4">
          {organizers.map((organizer) => (
            <div key={organizer.name} className="flex items-center gap-3 group">
              <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-extrabold text-white shadow-md group-hover:bg-blue-500 transition-colors">
                {organizer.initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">
                  {organizer.name}
                </p>
                <p className="text-xs text-gray-400">
                  {organizer.responsibility.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {mainContact?.email && (
        <a
          href={`mailto:${mainContact.email}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Mail className="size-4" />
          {mainContact.email}
        </a>
      )}
    </section>
  );
}
