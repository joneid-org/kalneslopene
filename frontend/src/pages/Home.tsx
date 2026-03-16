import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import RaceInfoBlock from "../components/RaceInfoBlock.tsx";
import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";

export function Home() {
  const { data: races, isLoading } = useQuery(QUERIES.upComingRaces);

  return (
    <div className="px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <div className="flex flex-col lg:flex-row items-start gap-6">
        <div className="flex flex-col gap-8 lg:flex-1 min-w-0 w-full lg:items-center">
          <div className="w-full lg:max-w-2xl">
            <RaceInfoBlock races={races} />
          </div>
          <div className="w-full lg:max-w-2xl">
            <NewsFeed />
          </div>
          <div className="w-full lg:max-w-2xl">
            <OrganisersBlock />
          </div>
        </div>

        {/* ── Sidebar — 1/4 width ── */}
        <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
          <RaceCalendarSidebar races={races} isLoading={isLoading} />
        </aside>
      </div>
    </div>
  );
}
