import Blogpost from "../components/Blogpost.tsx";

export function Home() {
  return (
    <div className="flex flex-col items-center gap-4 px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <Blogpost />
      <Blogpost />
      <Blogpost />
      <Blogpost />
      <Blogpost />
    </div>
  );
}
