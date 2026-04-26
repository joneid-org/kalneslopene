import { useParams } from "react-router";
import Results from "../components/Results.tsx";

export function Resultater() {
  const { uuid } = useParams<{
    uuid: string;
  }>();

  return (
    <div className="w-full max-w-[80vw] mx-auto px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <Results uuid={uuid} />
    </div>
  );
}
