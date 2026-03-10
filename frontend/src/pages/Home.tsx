import HomeFooter from "../components/HomeFooter.tsx";
import NewsFeed from "../components/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import RaceCalendarSidebar from "../components/RaceCalendarSidebar.tsx";
import RaceInfoBlock from "../components/RaceInfoBlock.tsx";

export function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <div className="flex-1 px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* ── Main block — centred, 2/4 width ── */}
          <div className="flex flex-col gap-8 lg:flex-1 min-w-0 w-full items-center">
            <div className="w-full max-w-[50vw]">
              {/* 3.1 Race information */}
              <RaceInfoBlock />
            </div>

            <div className="w-full max-w-[50vw]">
              {/* 3.2 News feed */}
              <NewsFeed />
            </div>

            <div className="w-full max-w-[50vw]">
              {/* 3.3 Organisers */}
              <OrganisersBlock />
            </div>
          </div>

          {/* ── Sidebar — 1/4 width ── */}
          <aside className="w-full lg:w-1/4 shrink-0 lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
            <RaceCalendarSidebar />
          </aside>
        </div>
      </div>

      {/* ── Footer ── */}
      <HomeFooter />
    </div>
  );
}
