"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{ padding: 40, textAlign: "center", fontFamily: "sans-serif" }}>
          <h2 style={{ marginBottom: 16 }}>Algo salió mal</h2>
          <button
            onClick={() => reset()}
            style={{
              padding: "10px 24px",
              background: "#1CABB0",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 16,
            }}
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
