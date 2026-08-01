// Root-level loading skeleton — shown during route transitions / streaming.
// Mirrors the collection grid so there is zero perceived layout jump.
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1360px] px-5 py-16 sm:px-8"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading…</span>
      <div className="h-8 w-56 animate-pulse rounded-full bg-paper-3" />
      <div className="mt-4 h-4 w-80 max-w-full animate-pulse rounded-full bg-paper-2" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="overflow-hidden rounded-xl2 border border-line bg-paper-2"
          >
            <div className="aspect-square animate-pulse bg-paper-3" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-paper-3" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-paper-3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
