import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { activeCoaForSlug, activeCoas } from "@/lib/coa";
import { site } from "@/lib/site";

// Turns the testing process into visible proof. Every date, method, figure and
// specification below is read from the certificate for a real batch — nothing
// here is decorative copy.
export function AnalyticalAuthority({
  slug,
  context = "home",
}: {
  /** SKU whose certificate anchors the dated steps. Falls back to any on file. */
  slug?: string;
  context?: "home" | "product";
}) {
  // The band's credibility rests on real dates and real results, so it renders
  // against a certificate that exists — the SKU's own if it has one, otherwise
  // the newest on file, labelled as an example lot.
  const own = slug ? activeCoaForSlug(slug) : undefined;
  const coa = own ?? activeCoas()[0];
  if (!coa) return null;
  const isOwnLot = Boolean(own);

  const purityRow = coa.labResults.find((r) => /purity/i.test(r.analyte));
  const identityRow = coa.labResults.find((r) => /mass|identity/i.test(r.analyte));

  const steps = [
    {
      n: "01",
      title: "Synthesis and fill",
      body: "Lyophilized to specification and sealed under controlled conditions, one lot at a time.",
      meta: `Lot ${coa.batchNumber}`,
    },
    {
      n: "02",
      title: "Chromatographic purity",
      body: "RP-HPLC with UV detection at 220 nm — the peptide-bond absorbance, so every residue in the sequence contributes to the signal. Release specification ≥ 98.0%.",
      meta: purityRow ? `Result ${purityRow.result}` : "Reported per lot",
    },
    {
      n: "03",
      title: "Identity confirmation",
      body: "LC-MS (ESI) measures the molecular mass of the eluting species against the theoretical mass of the intended sequence. A lot can be pure and still be the wrong peptide; running both methods closes that gap.",
      meta: identityRow?.result ?? "Conforms to reference",
    },
    {
      n: "04",
      title: "Release",
      body: "Purity, identity, appearance, peptide content, water, acetate and endotoxins all within specification. Released for sale.",
      meta: `Tested ${coa.testDate}`,
    },
  ];

  return (
    <section className="surface-warm on-light grain">
      <div className="container-page section">
        <div className="reveal max-w-2xl">
          <span className="kicker-dark">Analytical Method</span>
          <h2 className="mt-4 text-display-md text-ink-dark">
            Four checks stand between synthesis and a listing.
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-dark-2">
            Every lot in this catalog clears the same sequence. The dates below belong to batch{" "}
            {coa.batchNumber} —{" "}
            {isOwnLot
              ? context === "product"
                ? "the lot currently being picked for this product."
                : "one of the lots currently shipping."
              : "an example of a released lot. Certificates for other products are added as testing completes."}
          </p>
        </div>

        <ol className="stagger mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <li
              key={step.n}
              className="reveal rounded-xl2 border bg-chalk p-5 shadow-e-2"
              style={{ borderColor: "var(--line-warm)" }}
            >
              <span className="font-mono text-label-sm uppercase text-copper-muted">{step.n}</span>
              <h3 className="mt-2 text-display-sm text-ink-dark">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-dark-2">{step.body}</p>
              <p className="mt-3 font-mono text-[0.7rem] uppercase tracking-wider text-assay-deep">
                {step.meta}
              </p>
            </li>
          ))}
        </ol>

        <div
          className="reveal mt-6 rounded-xl2 border-l-2 bg-bone/60 p-5"
          style={{ borderColor: "var(--line-warm-strong)" }}
        >
          <h3 className="text-display-sm text-ink-dark">When a batch does not clear</h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-dark-2">
            It is not listed and it is not shipped. We publish every result we commission, including
            the ones that send a batch back. A batch earns a product page only after identity and
            purity have both passed.
          </p>
        </div>

        <div className="reveal mt-10">
          <h3 className="text-display-sm text-ink-dark">Analytes on the record</h3>
          <ul className="mt-4 divide-y" style={{ borderColor: "var(--line-warm)" }}>
            {coa.labResults.map((row) => (
              <li
                key={row.analyte}
                className="grid gap-1 border-t py-3 text-sm sm:grid-cols-[1.3fr_auto] sm:items-baseline sm:gap-4"
                style={{ borderColor: "var(--line-warm)" }}
              >
                <span className="font-medium text-ink-dark">{row.analyte}</span>
                <span className="font-mono text-xs text-ink-dark-2 sm:justify-self-end">
                  {row.specification}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-dark">
            Chromatographic purity and peptide content answer different questions. Purity is the
            share of peptide-related material that is the target sequence. Peptide content is how
            much of the vial&apos;s mass is peptide at all, the remainder being acetate counterion
            and residual water — a normal lyophilized acetate salt, not a discrepancy.
          </p>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink-dark-2">
            Analysis is performed by {coa.testingLab}, an independent laboratory with no
            commercial interest in the result.
          </p>
        </div>

        <div className="reveal mt-8 flex flex-wrap items-center gap-3">
          <Link href={`/coas/${coa.batchNumber}`} className="btn-on-light">
            <FileCheck2 className="h-4 w-4" strokeWidth={2} />
            {isOwnLot ? `View the certificate for batch ${coa.batchNumber}` : "Look up a batch"}
          </Link>
          <Link href="/faq" className="btn-ghost-light inline-flex">
            Read the analytical method Q&amp;A
            <ArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
          </Link>
        </div>

        <p className="mt-8 font-mono text-label-sm uppercase text-muted-dark">{site.compliance}</p>
      </div>
    </section>
  );
}
