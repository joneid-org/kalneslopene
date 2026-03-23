import { useParams } from "react-router";
import Results from "../components/Results.tsx";

export function Resultater() {
  const { year, raceNumber } = useParams<{
    year: string;
    raceNumber: string;
  }>();
  return (
    <div className="flex justify-center px-2 py-4 sm:px-4 sm:py-6 md:px-8 md:py-8">
      <Results year={year ? Number(year) : undefined} dateMonth={raceNumber} />
    </div>
  );
}
