import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { faqCategories } from "@/lib/faq";

// Warm light band before the footer — creates a second light moment in the
// lower page so the dark footer reads as a distinct close.
export function FaqPreview() {
  const preview = faqCategories.map((cat) => cat.items[0]);

  return (
    <section className="surface-bone on-light border-t" style={{ borderColor: "var(--line-warm-strong)" }}>
      <div className="container-page section">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker-dark inline-flex items-center gap-2">
              Frequently Asked
            </span>
            <h2 className="mt-3 text-display-md text-ink-dark">Common research questions</h2>
          </div>
          <Link href="/faq" className="btn-ghost-light inline-flex">
            View all FAQs
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="stagger mt-8 grid gap-4 sm:grid-cols-2">
          {preview.map((item) => (
            <div
              key={item.question}
              className="reveal rounded-xl2 border bg-chalk p-5 shadow-e-2"
              style={{ borderColor: "var(--line-warm)" }}
            >
              <p className="font-medium text-ink-dark">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-dark">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
