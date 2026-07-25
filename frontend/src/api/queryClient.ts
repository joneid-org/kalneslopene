import {
  keepPreviousData,
  MutationCache,
  QueryCache,
  QueryClient,
} from "@tanstack/react-query";
import ky, { HTTPError } from "ky";
import { toast } from "sonner";

function handleRateLimit(error: unknown) {
  if (error instanceof HTTPError && error.response.status === 429) {
    toast.error("For mange forespørsler. Vent litt og prøv igjen.", {
      id: "rate-limited",
    });
  }
}

// queryClient fungerer som en "cache", den sørger for å vise data som allerede er hentet fra backend i 2 min
// før evt kyClient henter data på nytt.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 2,
      retry: false,
    },
  },
  queryCache: new QueryCache({ onError: handleRateLimit }),
  mutationCache: new MutationCache({ onError: handleRateLimit }),
});

export const kyClient = ky.create({
  hooks: {
    beforeRequest: [
      (request) => {
        try {
          const raw = sessionStorage.getItem("auth_credentials");
          if (raw) {
            const { credentials } = JSON.parse(raw) as { credentials: string };
            request.headers.set("Authorization", `Basic ${credentials}`);
          }
        } catch {
          // ignore
        }
      },
    ],
  },
});
