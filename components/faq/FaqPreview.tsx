import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { faqCategories } from "@/lib/faq";

export function FaqPreview() {
  const preview = faqCategories.map((cat) => cat.items[0]);

  return (
    <section className="border-t border-line bg-paper-2">
      <div className="mx-auto max-w-[1280px] px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="kicker inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-cta" />
              Frequently Asked
            </span>
            <h2 className="mt-3 text-display-sm text-ink">Common research questions</h2>
          </div>
          <Link href="/faq" className="btn-ghost inline-flex">
            View all FAQs
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {preview.map((item) => (
            <div key={item.question} className="rounded-xl2 border border-line bg-paper p-5">
              <p className="font-medium text-ink">{item.question}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
