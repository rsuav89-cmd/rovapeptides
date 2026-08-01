// Product (family) detail loading skeleton — matches FamilyDetail's two-column
// layout so the page paints instantly with no layout shift.
export default function Loading() {
  return (
    <div
      className="mx-auto max-w-[1360px] px-5 py-10 sm:px-8 lg:py-14"
      aria-busy="true"
      aria-live="polite"
      aria-label="Loading product"
    >
      <span className="sr-only">Loading product…</span>
      <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-16">
        <div className="aspect-square animate-pulse rounded-xl2 border border-line bg-paper-3" />
        <div className="space-y-4">
          <div className="h-3 w-32 animate-pulse rounded-full bg-paper-3" />
          <div className="h-9 w-2/3 animate-pulse rounded-full bg-paper-3" />
          <div className="h-4 w-full animate-pulse rounded-full bg-paper-3" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-paper-3" />
          <div className="mt-2 flex gap-2">
            <div className="h-11 w-24 animate-pulse rounded-full bg-paper-3" />
            <div className="h-11 w-24 animate-pulse rounded-full bg-paper-3" />
          </div>
          <div className="h-12 w-full animate-pulse rounded-full bg-paper-3" />
        </div>
      </div>
    </div>
  );
}
