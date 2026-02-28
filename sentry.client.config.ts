import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Performance Monitoring
  tracesSampleRate: 0.1, // 10% of transactions in production

  // Session Replay — captures user sessions on error
  replaysSessionSampleRate: 0,    // Don't record normal sessions
  replaysOnErrorSampleRate: 1.0,  // Record 100% of sessions with errors

  integrations: [
    Sentry.replayIntegration(),
    Sentry.browserTracingIntegration(),
  ],

  // Filter out noisy errors
  ignoreErrors: [
    "ResizeObserver loop",
    "Non-Error promise rejection",
    "Load failed",
    "Failed to fetch",
  ],

  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",
});
