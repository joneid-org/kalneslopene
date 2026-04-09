import { useQuery } from "@tanstack/react-query";
import { Mail } from "lucide-react";
import { QUERIES } from "@/api/queries.ts";
import { getContactPerson } from "@/lib/utils.ts";

export default function OrganisersBlock() {
  const { data: organizers } = useQuery(QUERIES.organizer.getAllOrganizers);
  const mainContact = getContactPerson(organizers ?? []);

  return (
    <section className="space-y-5 pb-4">
      <div className="flex flex-wrap gap-5">
        {organizers?.map((organizer) => (
          <div key={organizer.name} className="flex items-center gap-3 group">
            <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-xs font-extrabold text-white group-hover:bg-blue-500 transition-colors">
              {organizer.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-none">
                {organizer.name}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {organizer.responsibility.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
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
