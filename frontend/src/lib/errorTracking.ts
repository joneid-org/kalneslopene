import * as Sentry from "@sentry/react";
import type { ErrorInfo } from "react";
import { type ClientOnErrorFunction, isRouteErrorResponse } from "react-router";
import type { ConfigDTO } from "@/model/DTO.ts";

const MAX_BUFFERED_ERRORS = 10;

type CapturedError = { error: unknown; errorInfo?: ErrorInfo };

let initialized = false;
let bufferedErrors: CapturedError[] = [];

function capture({ error, errorInfo }: CapturedError) {
  if (errorInfo) {
    Sentry.captureReactException(error, errorInfo);
  } else {
    Sentry.captureException(error);
  }
}

function report(error: unknown, errorInfo?: ErrorInfo) {
  if (!error) return;
  if (initialized) {
    capture({ error, errorInfo });
  } else if (bufferedErrors.length < MAX_BUFFERED_ERRORS) {
    bufferedErrors.push({ error, errorInfo });
  }
}

function bufferWindowError(event: ErrorEvent | PromiseRejectionEvent) {
  report("reason" in event ? event.reason : event.error);
}

// Sentry can only start once /api/config has delivered the DSN, so anything thrown during
// the first render would be lost. Hold onto those errors until the DSN arrives.
export function bufferErrorsUntilInitialized() {
  window.addEventListener("error", bufferWindowError);
  window.addEventListener("unhandledrejection", bufferWindowError);
}

// react-router's route ErrorBoundary catches render errors, which stops React from
// forwarding them to window.onerror, so the router has to report them itself.
export const reportRouterError: ClientOnErrorFunction = (
  error,
  { errorInfo },
) => {
  if (isRouteErrorResponse(error) && error.status < 500) return;
  report(error, errorInfo);
};

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

  window.removeEventListener("error", bufferWindowError);
  window.removeEventListener("unhandledrejection", bufferWindowError);
  for (const buffered of bufferedErrors) {
    capture(buffered);
  }
  bufferedErrors = [];
}
