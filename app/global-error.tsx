"use client";

// Catches errors thrown in the ROOT layout itself. It replaces <html>/<body>,
// so globals.css and brand fonts are not guaranteed here — styles are inlined and
// use the brand palette (obsidian #000, copper #CE8A74) so it still looks on-brand.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          background: "#000000",
          color: "#FFFFFF",
          fontFamily:
            "'Montserrat', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: "30rem" }}>
          <p
            style={{
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontSize: "12px",
              fontWeight: 600,
              color: "#CE8A74",
              margin: 0,
            }}
          >
            Critical Error
          </p>
          <h1 style={{ fontSize: "30px", fontWeight: 700, margin: "16px 0 0" }}>
            The application hit a problem
          </h1>
          <p style={{ color: "#B7B7C0", lineHeight: 1.6, marginTop: "12px" }}>
            Please reload the page. If it keeps happening, try again shortly.
          </p>
          <button
            onClick={() => reset()}
            style={{
              marginTop: "28px",
              padding: "12px 28px",
              borderRadius: "999px",
              border: "none",
              background: "#CE8A74",
              color: "#000000",
              fontWeight: 600,
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            Reload
          </button>
          {error?.digest && (
            <p style={{ marginTop: "20px", fontSize: "11px", color: "#6b6b73" }}>
              ref: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
