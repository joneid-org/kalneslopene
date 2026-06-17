import { SeasonStatBoxes } from "@/components/SeasonStatBoxes.tsx";
import { Hero } from "../components/Hero/Hero.tsx";
import NewsFeed from "../components/News/NewsFeed.tsx";
import OrganisersBlock from "../components/OrganisersBlock.tsx";
import { Slogan } from "../components/Slogan.tsx";
import SponsorsBlock from "../components/SponsorsBlock.tsx";

export function Home() {
  return (
    <div className="flex flex-col gap-3 sm:gap-10">
      <Hero />
      <div className="flex flex-col page-content gap-6 sm:gap-12">
        <Slogan />
        <NewsFeed />
        <SeasonStatBoxes />
        <OrganisersBlock />
        <SponsorsBlock />
      </div>
    </div>
  );
}
