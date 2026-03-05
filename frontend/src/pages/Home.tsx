import Blogpost from "../components/Blogpost.tsx";

export function Home() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <Blogpost />
      <Blogpost />
      <Blogpost />
      <Blogpost />
      <Blogpost />
    </div>
  );
}
