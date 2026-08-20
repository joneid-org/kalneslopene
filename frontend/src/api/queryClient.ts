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

function handleMutationError(error: unknown) {
  if (!navigator.onLine) {
    toast.error("Ingen internettforbindelse. Sjekk tilkoblingen din.", {
      id: "network-error",
    });
    return;
  }
  if (error instanceof HTTPError && error.response.status === 429) {
    toast.error("For mange forespørsler. Vent litt og prøv igjen.", {
      id: "rate-limited",
    });
    return;
  }
  // The afterResponse hook already redirects to login; a generic error toast on top would be noise.
  if (error instanceof HTTPError && error.response.status === 401) {
    return;
  }
  toast.error("Noe gikk galt. Prøv igjen.", { id: "mutation-error" });
}

// A 401 from these is a normal answer, not an expired session: the first three mean "wrong
// credentials" and must keep rendering their own message, and /me is how we probe for a session
// in the first place.
const AUTH_ENDPOINTS_EXEMPT_FROM_REDIRECT = [
  "/api/auth/login",
  "/api/auth/setup",
  "/api/auth/register/",
  "/api/auth/me",
];

let unauthorizedHandler: (() => void) | null = null;

/** kyClient is a module singleton outside React, so AuthProvider registers its reaction here. */
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

function readCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
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
    mutations: {
      // Default networkMode "online" silently pauses mutations while offline
      // instead of failing, so the user never gets the "no connection" toast below.
      networkMode: "always",
    },
  },
  queryCache: new QueryCache({ onError: handleRateLimit }),
  mutationCache: new MutationCache({ onError: handleMutationError }),
});

export const kyClient = ky.create({
  credentials: "include",
  hooks: {
    beforeRequest: [
      (request) => {
        if (request.method === "GET" || request.method === "HEAD") return;
        const token = readCookie("XSRF-TOKEN");
        if (token) {
          request.headers.set("X-XSRF-TOKEN", token);
        }
      },
    ],
    afterResponse: [
      (request, _options, response) => {
        if (response.status !== 401) return;
        const path = new URL(request.url).pathname;
        if (
          AUTH_ENDPOINTS_EXEMPT_FROM_REDIRECT.some((endpoint) =>
            path.startsWith(endpoint),
          )
        ) {
          return;
        }
        unauthorizedHandler?.();
      },
    ],
  },
});
