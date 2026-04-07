import { useQuery } from "@tanstack/react-query";
import { Mail, Users } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { getContactPerson } from "@/lib/utils.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  const O_TEXT =
    "Torsdagsløpet er et frivillig drevet mosjonsløp som har arrangert ukentlige løp siden 2018. Vi er en gjeng entusiaster som brenner for løping og fellesskap.";

  return (
    <section className="space-y-6 pb-4">
      {/* Section heading */}
      <div className="flex items-center gap-3">
        <div className="h-7 w-1 rounded-full bg-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Om arrangørene
        </h2>
        <Users className="size-4 text-gray-400 ml-1" />
      </div>

      <p className="text-sm text-gray-500 leading-relaxed">{O_TEXT}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {organizers?.map((organizer) => (
          <div
            key={organizer.name}
            className="flex flex-col items-center text-center gap-2.5 p-4 rounded-2xl bg-white border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all"
          >
            <div className="size-12 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-sm">
              {organizer.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">
                {organizer.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {organizer.responsibility.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-1">
        <a
          href={`mailto:${mainContact?.email}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
        >
          <Mail className="size-4" />
          Kontakt oss
        </a>
      </div>
    </section>
  );
}
