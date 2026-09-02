import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { QUERIES } from "@/api/queries.ts";
import { fuzzySearch } from "@/lib/searchUtils.ts";

const MAX_RESULTS = 20;

export function useRunnerSearch(
  query: string,
  options: { isVerifiedOnly?: boolean; excludeUuids?: Set<string> } = {},
) {
  const { data, isLoading } = useQuery(
    QUERIES.runner.getRunners(undefined, options.isVerifiedOnly || undefined),
  );

  const matches = useMemo(
    () => fuzzySearch(data ?? [], query, (r) => r.name),
    [data, query],
  );

  const runners = matches
    .filter((r) => !options.excludeUuids?.has(r.uuid))
    .slice(0, MAX_RESULTS);

  return { runners, isLoading };
}
