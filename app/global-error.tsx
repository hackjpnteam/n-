"use client";
export default function GlobalError({ error, reset }: { error: any; reset: () => void }) {
  return (
    <html>
      <body style={{ padding: 24, fontFamily: "ui-sans-serif" }}>
        <h1>Something went wrong</h1>
        <pre style={{ whiteSpace: "pre-wrap" }}>{String(error?.message ?? error)}</pre>
        <button onClick={() => reset()} style={{ marginTop: 12, padding: "6px 12px" }}>
          Reload
        </button>
      </body>
    </html>
  );
}