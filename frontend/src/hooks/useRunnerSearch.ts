import { useQuery } from "@tanstack/react-query";
import { QUERIES } from "@/api/queries.ts";

const MAX_RESULTS = 20;

export function useRunnerSearch(
  query: string,
  options: { isVerifiedOnly?: boolean; excludeUuids?: Set<string> } = {},
) {
  const { data, isLoading } = useQuery(
    QUERIES.runner.getRunners(undefined, options.isVerifiedOnly || undefined),
  );

  const runners = (data ?? [])
    .filter((r) => r.name.toLowerCase().includes(query.toLowerCase()))
    .filter((r) => !options.excludeUuids?.has(r.uuid))
    .slice(0, MAX_RESULTS);

  return { runners, isLoading };
}
