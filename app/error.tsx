"use client";

import { useEffect } from "react";

// Route-level error boundary. Rendered inside the root layout, so brand fonts,
// tokens, and the cart provider are all available.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surface to the console / monitoring without leaking details to the user.
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[70vh] place-items-center bg-paper px-6 text-center">
      <div className="max-w-md">
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-muted">
          Error 500
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold uppercase leading-tight text-ink">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-2">
          A temporary problem interrupted this page. You can try again, or head back to
          the store.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <button onClick={() => reset()} className="btn-signal">
            Try again
          </button>
          <a href="/shop" className="btn-ghost">
            Browse the shop
          </a>
        </div>
        {error?.digest && (
          <p className="mt-6 font-sans text-[0.6rem] uppercase tracking-widest text-muted">
            ref: {error.digest}
          </p>
        )}
      </div>
    </main>
  );
}
