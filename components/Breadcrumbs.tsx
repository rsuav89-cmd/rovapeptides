export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mx-auto max-w-[1280px] px-5 pt-6 sm:px-8">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 && <span aria-hidden className="text-line-strong">/</span>}
              {isLast || !item.href ? (
                <span className={isLast ? "font-medium text-ink" : undefined}>{item.label}</span>
              ) : (
                <a href={item.href} className="transition-colors hover:text-ink">
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
