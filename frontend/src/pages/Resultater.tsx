import { useParams } from "react-router";
import Results from "../components/Results.tsx";

export function Resultater() {
  const { uuid } = useParams<{
    uuid: string;
  }>();

  return (
    <div className="page-content">
      <Results uuid={uuid} />
    </div>
  );
}
