import { useRef, useState } from "react";
import RaceStatistics from "@/components/Statistics/RaceStatistics.tsx";
import RunnerStatistics from "@/components/Statistics/RunnerStatistics.tsx";
import type { RunnerDTO } from "@/model/DTO.ts";

export function Statistics() {
  const [selectedRunner, setSelectedRunner] = useState<RunnerDTO | null>(null);
  const runnerSectionRef = useRef<HTMLElement>(null);

  const openRunner = (runner: RunnerDTO) => {
    setSelectedRunner(runner);
    runnerSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="page-content flex flex-col gap-8 md:grid md:grid-cols-[1fr_1.3fr] md:items-start md:gap-6 *:min-w-0">
      <RaceStatistics onSelectRunner={openRunner} />
      <RunnerStatistics
        ref={runnerSectionRef}
        selectedRunner={selectedRunner}
        onSelectRunner={setSelectedRunner}
      />
    </div>
  );
}
