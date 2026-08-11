import * as Sentry from "@sentry/react";
import type { ConfigDTO } from "@/model/DTO.ts";

const MAX_BUFFERED_ERRORS = 10;

let initialized = false;
let bufferedErrors: unknown[] = [];

function bufferError(event: ErrorEvent | PromiseRejectionEvent) {
  const error = "reason" in event ? event.reason : event.error;
  if (!error || bufferedErrors.length >= MAX_BUFFERED_ERRORS) return;
  bufferedErrors.push(error);
}

// Sentry can only start once /api/config has delivered the DSN, so anything thrown during
// the first render would be lost. Hold onto those errors until the DSN arrives.
export function bufferErrorsUntilInitialized() {
  window.addEventListener("error", bufferError);
  window.addEventListener("unhandledrejection", bufferError);
}

export function initErrorTracking(config: ConfigDTO) {
  if (initialized || !config.sentryDsn) return;
  initialized = true;

  Sentry.init({
    dsn: config.sentryDsn,
    environment: config.environment,
    release: config.release ?? undefined,
    sendDefaultPii: false,
    tracesSampleRate: 0,
  });

  window.removeEventListener("error", bufferError);
  window.removeEventListener("unhandledrejection", bufferError);
  for (const error of bufferedErrors) {
    Sentry.captureException(error);
  }
  bufferedErrors = [];
}
