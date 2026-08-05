# Competitive Teardown — Amino Club vs. ROVA

Analysis date: August 2026. Competitor observed at `aminoclub.com/us` (homepage, `/store`,
`/products/bpc-157`). ROVA assessed from the working tree at `da6435d` plus uncommitted work.

**Observation limits, stated up front.** Amino Club gates `/products` and
`/certificates-of-analysis` behind a researcher-verification interstitial (21+ and a
qualified-researcher confirmation), so those two surfaces returned the gate rather than
content. Their PDP dosage dropdown rendered as "Select a dosage" with no options exposed to
a non-JS fetch, so their variant UX is inferred from the "From $X" price convention rather
than directly observed. A delivery window on the BPC-157 PDP read "Thu, May 14 – Wed, May
20", which is stale relative to the analysis date — treat their date logic as unverified.

---

## 1. Competitor deconstruction

### Trust & proof anchors

Their entire brand is a trust argument, and it is front-loaded. The hero reads
**"Research Peptides You Can Trust"** over **"Research-grade peptides with Certificate of
Analysis on every batch. 99%+ identity purity, third-party tested."** — the proof claim is
in the subheadline, not buried in a section below.

The strongest single move is on the PDP: a **Certificate of Analysis accordion sitting
above the buy button**, showing a real measured figure ("99.11% Purity"), a lot number
("Lot #P0142"), a test date ("tested Feb 4, 2026"), and a **named laboratory — "Third Party
Tested by Freedom Diagnostics"**. Naming the lab is the difference between a claim and a
citation, and most competitors in this category do not do it.

They also merchandise the *process*, not just the result: a "5 Quality Checks / 100% U.S.
Verified" section broken into **Verified Potency (HPLC Analysis)**, **99%+ Purity Guaranteed
(Mass Spectrometry)**, **Long-Term Stability (pH & Stability Testing)**, **Contaminant-Free
(Sterility & LAL Testing)**, and **Batch-to-Batch Consistency (QC Verification)**. Each check
gets a heading, so the testing programme occupies five screens of scroll rather than one line.

Risk reversal is unusually strong and — critically — **free**: "Free shipment protection on
every order… If your package is lost, damaged, or stolen in transit, we'll reship it at no
cost." Shipping anxiety is the top abandonment driver for this category and they remove it at
zero friction. Supporting badges: SSL Secured, 99%+ Purity, Shipment Protection, "256-bit SSL",
"Free COA included with every order", "Third Party tested in America".

Notably **absent**: no reviews, no star ratings, no testimonials, no press logos, no
influencer content. In a regulated category that is a deliberate and correct choice, and it
means neither of us can win on social proof — only on analytical proof.

### Product catalog & layout

28 products, **every one priced**, all displayed as **"From $69.99"** — the "From" convention
signals tiered dosage options and sets a low entry anchor. Naming follows a rigid two-part
convention: compound name plus a **category descriptor** — "BPC-157 · Cellular Peptide",
"GHK-Cu · Dermal Compound", "GLP-3 (RT) · Triple-Action Metabolic Compound", "SELANK ·
Cognitive & Anxiolytic Peptide". That descriptor is doing real work: it teaches an unfamiliar
buyer what category a molecule belongs to without a claim.

Catalog controls: a sort dropdown with **Most Popular / A–Z / Z–A / Price low→high / Price
high→low / Newest**. Page heading "All Products", subheading "Premium research peptides with
99%+ purity".

Cards carry image, name, descriptor, "From $" price, a **"View Studies"** link and a "View"
button. No stock indicators, no variant pickers on the card.

Blends are merchandised as first-class products with named identities — "BPC-157/TB-500
(Wolverine) · From $109.99", "GLOW · From $114.99", "KLOW · From $129.99" — and they sit at
the top of the price ladder, which makes them margin drivers rather than afterthoughts.

The PDP carries a **Compound Information** accordion with a full **Molecular Profile: CAS
number, molecular weight, sequence, formula**, plus stability information by form. And a
**Sources & References** section listing 12+ peer-reviewed citations with DOI/PMID (HSS
Journal, Nature Scientific Reports, Frontiers in Pharmacology). For a researcher audience
this is the single most credible thing on the page.

### Copywriting & positioning

Register is warm-professional rather than clinical: "Research-grade quality meets
researcher-friendly pricing", "Expert support whenever you need it", "Extensive research
library at your fingertips", "Anywhere in the US, as fast as next day", "Why choose Amino
Club?". Headlines are benefit-shaped but stay inside RUO bounds by talking about *service*
(price, speed, support, documentation) rather than *effects*.

They lean on community: "Connect with fellow researchers. Share peer insights." The newsletter
is framed as documentation rather than marketing — "Subscribe for catalog updates, new
research compounds, and quality documentation news… For researchers and labs. No spam,
unsubscribe anytime."

Compliance is handled with a gate plus footer legal ("Research Use Only", "Disclaimer"),
rather than repeated inline disclaimers.

### Navigation & CRO hooks

A deliberately thin menu: **Products → All Products · Research → Research Library · Partner
Program → Affiliate · Contact us · Account** with a cart counter. Four destinations. The
Research Library is both a content-marketing asset and a retention hook; the Partner Program
is an acquisition channel we have no equivalent of.

Cart and PDP incentives observed: **"Free shipping on orders over $150"**, **"Overnight
shipping available"**, a displayed **delivery window**, a **"Free shipment protection?"**
option at the buy box, and a six-product related grid on the PDP that mixes cheaper singles
with higher-priced blends — a genuine upsell ladder.

No announcement bar. Shipping timing is stated in the FAQ: "Orders processed within 0–2
business days. Standard shipping takes 3–5 business days."

---

## 2. Direct comparison & gap analysis

| Criterion | Amino Club | ROVA (our store) | Verdict |
|---|---|---|---|
| **Hero & first fold** | Trust claim *is* the headline: "Research Peptides You Can Trust" + purity/COA/third-party in the subhead. Single CTA "Browse Catalog". | "Research peptides, verified to the batch." + COA-on-every-lot subhead. Two CTAs (Browse All Peptides / View Testing & COAs). Kicker now reads "USA Third-Party Tested · Per-Batch COA". | **Parity.** Ours is tighter editorially; theirs is blunter and arguably converts colder traffic faster. |
| **Product card density & typography** | Image, name, category descriptor, "From $X", "View Studies" + "View". Uniform, scannable, every card priced. | Image, category, name (Syncopate display), subtitle, mg + purity tags, batch line, price, quick-add. Denser and more designed. | **Split.** Ours carries more information per card; theirs is faster to scan and has no unpriced holes. Our "Pricing coming soon" on 27 of 40 SKUs is a hole theirs doesn't have. |
| **COA / lab transparency** | COA accordion above the buy button with measured purity, lot number, test date, **named lab**. COA library gated behind verification. | Batch proof strip above the price, in-page `BatchCoaPreview` modal, **42 server-rendered `/coas/[batch]` pages** with 7 analytes, methods, specs and pass/fail, publicly crawlable, `Certification` JSON-LD, plus lookup by batch number. | **We win, decisively** — provided the underlying certificate data becomes real. See §3. |
| **Variant selector UX** | "From $X" pricing implies dosage tiers; dropdown labelled "Select a dosage". BPC-157 exposed a single 10MG option at $39.99. | Pills carrying strength **and price**, sliding selection, per-mg unit economics, `aria-live` announcement, disabled state for unpriced strengths. | **We win.** A dropdown is the weakest pattern for 2–3 options; our pills show the price consequence before the click. |
| **Cart drawer conversion** | Cart counter; free-shipping threshold $150; shipment protection offered at the buy box. Drawer behaviour not observable. | Free-shipping progress bar, two cross-sell rows, payment-method chips, encrypted-checkout disclosure, COA match guarantee, 14-day returns, dispatch window, pre-flight ineligible-SKU gate. | **We win on features**, lose on the threshold ($200 vs their $150) and on shipment protection being a paid add-on rather than free. |
| **Mobile & navigation** | Four top-level destinations; verification gate adds one tap before any browsing. | Single-column cards below 520px, 44px targets, sticky buy bar with live shipping shortfall, focus-trapped drawers, skip link, WCAG 2.2 pass. | **We win on execution.** But their four-item menu beats our seven-item `primaryNav` with two duplicate `/shop` links. |

---

## 3. What we do better vs. what we're missing

### Our advantages

**Per-batch certificate infrastructure.** They show the *latest* COA per product; we generate
a static, crawlable page for **every batch** with the full seven-analyte table, methods,
specifications and pass/fail, wrapped in `Certification` schema, plus lookup by the number
printed on the vial. Theirs sits behind a verification gate — invisible to Google and to every
AI answer engine. Ours is the only version of this asset that can be cited.

**Machine readability.** `ProductGroup` + `hasVariant` with a real `AggregateOffer` range,
`FAQPage` generated from visible content, `CollectionPage`/`ItemList`, `BreadcrumbList`, and
`/llms.txt` exporting the full catalog with certificate URLs. This is a structural lead in AI
search that is expensive for them to close.

**Analytical depth in content.** Our FAQ explains how to read a chromatogram, why detection
runs at 220 nm rather than 280 nm, and what mass spectrometry confirms that HPLC cannot.
Amino Club asserts "HPLC Analysis" as a badge; we teach the method. For this audience,
teaching outranks badging.

**The published-failures policy.** "A batch that misses specification is not listed and is not
shipped. We publish every result we commission, including the ones that send a batch back."
That is a stronger trust device than any of their five quality checks, because it is an
admitted cost rather than a claimed benefit. It now sits directly under our Add button.

**Engineering quality as a moat.** Zero TypeScript errors, a 1,673-assertion QA suite gating
data integrity, RUO compliance, accessibility contracts and schema validity, and WCAG 2.2
work theirs shows no sign of. This lets us ship changes faster and more safely than they can.

**Per-mg unit pricing and the COA match guarantee** — neither has an equivalent on their site.

### What we're missing

**1. Molecular profile data.** Their PDP publishes CAS number, molecular weight, sequence and
formula. We deliberately omitted these because fabricating them across 33 families was
unacceptable — but the gap is real, and to a researcher it reads as us knowing less about our
own catalog. This is the single largest content gap.

**2. Peer-reviewed citations per product.** They list 12+ DOI/PMID-linked references per
compound. We have laboratory framing but no bibliography. For an audience trained to check
sources, a citation list is the highest-authority element a PDP can carry — and it is
RUO-safe, because citing literature is not claiming an outcome.

**3. A research library.** They have a content hub feeding SEO, retention and their "View
Studies" card link. We have a FAQ and nothing else. This is also the natural home for the
citations in gap 2.

**4. Free shipment protection.** Theirs is free on every order and prominently stated; ours is
a paid checkout add-on. Free loss/damage/theft coverage removes the single biggest anxiety in
a discreet-shipping category, and the cost is far lower than the conversion it buys.

**5. Delivery-date expectation and catalog sort.** They show a delivery window on the PDP and
offer six sort orders on the catalog. We show dispatch timing but never an arrival estimate,
and our homepage grid has category filters but no sort at all.

**6. Pricing coverage — the one that matters most.** 28 of their 28 products are priced.
27 of our 40 SKUs read "Pricing coming soon". Every advantage above is downstream of a buyer
being able to buy.

---

## 4. Prioritised recommendations

**P0 — Price the catalog.** Nothing else in this document outranks it. `lib/products.ts`
(prices) and `lib/woo-mapping.ts` (numeric Woo IDs must land in the same commit, or a priced
SKU silently vanishes at checkout). Our QA suite already fails the build if a purchasable SKU
lacks a mapping.

**P1 — Add a molecular profile block to the PDP.** Extend `ProductDetail` in
`lib/product-details.ts` with an optional `molecular?: { cas?, formula?, molecularWeight?, sequence? }`,
render it as a second spec table in `components/catalog/FamilyDetail.tsx`, and mirror it into
`additionalProperty` in `lib/jsonld.ts`. Populate only from a supplier spec sheet — the field
being optional means partial coverage ships safely, and a QA guard should assert we never
render a placeholder.

**P2 — Ship a citations section per family.** New `lib/product-references.ts` keyed by family
id with `{ title, journal, year, doi | pmid }`, rendered under the FAQ block in
`FamilyDetail.tsx` and emitted as `citation` in the Product schema. This closes their largest
authority advantage and compounds with our existing structured-data lead.

**P3 — Make shipment protection free and say so at the buy box.** Copy change in
`components/catalog/FamilyDetail.tsx` (trust stack), `components/cart/CartDrawer.tsx` (above
checkout) and `lib/site.ts` (a `shipmentProtection` flag so both read from one source).
Pair with lowering `freeShippingThreshold` from 200 to 150 to match them, if the margin allows.

**P4 — Delivery estimate on the PDP and in the cart.** A pure function in `lib/shipping.ts`
(dispatch within 1 business day + 2–5 business days transit, weekend-aware), rendered in the
trust stack and above the cart's checkout button. No new data required.

**P5 — Add sort controls to the catalog.** `components/catalog/Catalog.tsx` currently filters
but cannot sort; `components/catalog/CollectionView.tsx` already has a `SortKey` implementation
to lift. Reuse it rather than writing a second one.

**P6 — Cut the navigation from seven items to four.** `lib/site.ts` `primaryNav` contains two
links pointing at `/shop` ("Shop" and "All Peptides") and three category links whose
`?category=` parameters the `/shop` route never reads. Repoint them at real collection URLs and
drop the duplicates — this was flagged in an earlier audit and is a ten-minute change.

**P7 — Start the research library.** A `/research` route backed by MDX or a typed content
module, seeded with the analytical-method explainers already written in `lib/faq.ts`. Feeds
programmatic SEO, gives the citations in P2 a home, and is the retention asset we lack.

---

## Two risks worth naming

**Our certificate data is synthetic.** `lib/coa.ts` generates certificates from the catalog —
including the laboratory name "US Analytical Labs, Inc." and the test dates. Amino Club names
a real lab, Freedom Diagnostics, with a real lot number. Every recommendation above assumes
our COA infrastructure gets wired to genuine analytical documents before it ships. Publishing
generated certificates as though they were real testing records is a legal and reputational
exposure that outweighs the entire conversion upside of this teardown.

**Their verification gate is a compliance posture we lack.** A 21+ and qualified-researcher
confirmation before browsing costs them traffic and buys them a defensible position on intent.
Worth a policy decision rather than a code decision — but if the answer is yes, it belongs in
`app/layout.tsx` as an interstitial with a persisted acknowledgement.

**Sources:** [Amino Club — US homepage](https://www.aminoclub.com/us) · [All Products](https://www.aminoclub.com/us/store) · [BPC-157 PDP](https://www.aminoclub.com/us/products/bpc-157) · [SELANK PDP](https://www.aminoclub.com/us/products/selank) · [GLP-3 PDP](https://www.aminoclub.com/us/products/glp-3)
