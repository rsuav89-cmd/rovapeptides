# Payments — Competitor Processor Findings & ROVA Implementation Paths

I am not a lawyer or a financial advisor. Card-network rules, NACHA rules and bank terms change,
and underwriting outcomes are specific to your entity. Verify anything below with your acquirer
and counsel before committing.

---

## 1. Who processes Calibrated Labs' cards

**Strong circumstantial evidence for Stripe, but I could not confirm it**, and I want to be
precise about the difference.

What I actually observed: clicking ADD TO CART leaves their storefront entirely and lands on
`checkout.calibratedlabs.com` with these URL parameters:

```
customerId=cus_0a47b964c2cd
funnelSessionId=fs_1785973005245_heq6usm6r
funnelId=funnelv2_e169bc14fed1
checkoutToken=85f1a384d6b9e4b8a8af538b6e5cdcb9
```

`cus_` is Stripe's customer-object prefix convention. The checkout renders an **Apple Pay
button under an "Express Checkout" heading**, which is the standard Stripe Payment Request /
Express Checkout Element pattern. `funnelv2_` indicates a third-party funnel/checkout platform
sitting in front of the processor rather than a native WooCommerce checkout.

Why it is not confirmed: JavaScript execution was denied on the checkout domain, so I could not
enumerate loaded scripts or window globals — the definitive test (looking for `js.stripe.com`,
a `Stripe` global, or a `pk_live_` publishable key). The browser tab group then closed before I
could retry. **I can finish this in about two minutes if you reopen a tab and let me run one
script on that domain.**

The irony worth noting: if they are on Stripe, they are running a vertical Stripe explicitly
prohibits. That is exactly the fragility the alternative processors market against — and it is
also why their entire checkout sits on a separate funnel domain.

---

## 2. The structural problem you are actually solving

Every mainstream processor — **Stripe, PayPal, Braintree, Square, Shopify Payments** — lists
research peptides as a prohibited business. This is not a pricing question or an integration
question. It determines which methods are even reachable:

| Method | Depends on | Reachable for peptides? |
|---|---|---|
| Cards (Visa/MC/Amex) | A high-risk merchant account + gateway | Yes, via high-risk acquiring |
| **Apple Pay** | The **underlying gateway**, not Apple | Only if your gateway supports it |
| **Google Pay** | Same as Apple Pay | Same |
| **ACH** | NACHA rails, not card networks | Yes — usually the most durable |
| **Cash App Pay** | Block/Square as acquirer | Effectively no for this vertical |
| **Zelle** | Bank P2P rails | Not a merchant product — see §5 |
| Crypto | Wallet infrastructure | Yes, with its own tradeoffs |

**Apple Pay is not a payment method you integrate. It is a presentation layer over a card
transaction.** You cannot add it without a processor that already accepts your vertical. Get the
merchant account right and Apple Pay is a checkbox plus a domain-verification file. Get it wrong
and no amount of frontend work produces a working Apple Pay button.

---

## 3. The realistic stack

**Path A — high-risk merchant account + NMI or Authorize.net gateway.** This is the standard
architecture for this industry. A high-risk acquirer underwrites the MID; the gateway is the
technical layer. Both **NMI** and **Authorize.net** support Apple Pay and Google Pay, both have
mature WooCommerce plugins, and both support ACH through the same integration. One integration
unlocks cards, wallets and bank debit together.

Expect: 3.5–6% plus per-transaction fees, a rolling reserve (commonly 5–10% held 90–180 days),
a monthly minimum, and real underwriting — incorporation documents, processing history,
chargeback ratios, and a compliant website. **Your published-COA infrastructure and the RUO
compliance work already in this codebase are genuine underwriting assets.** Underwriters look at
the site. Ours reads as a documented laboratory supplier, which is materially easier to approve
than a site making outcome claims.

**Path B — ACH as the durable base layer.** ACH is not governed by card-network vertical
prohibitions, so it survives where cards get shut off. Lower cost per transaction, no chargeback
mechanism in the card sense (though returns and unauthorised-debit disputes exist under NACHA).
Worth having regardless of Path A, and it suits wholesale and repeat lab buyers particularly
well. Providers to price: GoCardless, and the ACH offering bundled with whichever high-risk
gateway you select.

**Path C — 2Checkout (Verifone).** I read your "2Hours" as **2Checkout** — tell me if you meant
something else. It is a merchant-of-record platform, which is a genuinely different model: they
become the seller of record and take on compliance and tax liability. That can be attractive for
a prohibited-ish vertical, but MoR platforms are conservative about exactly these categories, so
approval is the open question, not integration. Rates are higher (typically 4.5%+ for the MoR
model).

---

## 4. ePayVista — read this carefully before integrating

I looked at their site. Their claims:

> "1% flat fee" · "No underwriting. No KYC. No waiting" · "Zero chargebacks. Ever" ·
> "Stripe and PayPal classify peptides as prohibited. Accept cards anyway" ·
> "100% of verticals are approved" · settlement in USDC/USDT to your own wallet, non-custodial.

**Four things concern me, and I would want answers before routing a single customer card
through it.**

**No KYC is not a feature.** Any entity handling US card payments sits inside the BSA/AML
regime, and KYB/KYC is a legal obligation, not a convenience. A payments company advertising its
absence is either not doing what a processor does, or not doing what a processor must.

**"Zero chargebacks. Ever" is not something a card processor can offer.** Chargeback rights are
granted to cardholders by Visa and Mastercard operating rules. A provider cannot remove them. It
can only place itself somewhere those rules do not reach — which raises the question of what the
cardholder's statement actually shows and under whose MID the transaction runs. If the answer is
a different merchant name or MCC, that is **transaction laundering**, which the card networks
prohibit and which can end in fines, MATCH-list placement, and the loss of your ability to
process cards anywhere for years.

**"Accept cards anyway" is marketing a workaround of a network prohibition** — not a licence
that makes the prohibition go away.

**Non-custodial crypto settlement cuts both ways.** "We never hold your funds" also means no
recourse, no reserve to claw back from, and no counterparty obligation if something breaks. Your
revenue arrives as USDC/USDT, so you also inherit conversion, custody and tax-reporting work.

**What I would ask them, in writing:** Who is the acquiring bank? What MID and MCC will
transactions run under, and what descriptor appears on the cardholder's statement? Are you a
registered ISO/PSP, and with which networks? What happens when a cardholder disputes with their
issuing bank regardless of your policy? Do you hold money-transmitter licences in the states we
sell into?

If they cannot answer those clearly, the 1% is not a discount — it is the price of the risk being
moved onto you.

---

## 5. Cash App and Zelle — what you are currently advertising

`lib/site.ts` lists Visa, Mastercard, Cash App and Zelle in the footer and cart chips. Worth
being precise about what those two are:

**Cash App Pay** is a Block/Square product. Offering it as a real checkout method means Square
or Stripe as acquirer, both of which prohibit this vertical. If you are currently taking Cash App
payments manually (customer sends, you mark the order paid), that is an offline payment method,
not an integration.

**Zelle has no merchant product.** It is bank-to-bank P2P. Most participating banks' terms
restrict consumer Zelle to payments between people who know each other and explicitly exclude
purchases of goods and services; there is no buyer or seller protection, no merchant API, and no
dispute mechanism. Businesses do use it, but banks close accounts over commercial P2P volume,
and a customer who pays this way has no recourse — which is a poor fit for a brand whose entire
argument is documented trustworthiness.

**Recommendation:** if these stay, present them accurately as *manual bank/app transfer, invoiced
before dispatch*, rather than as checkout methods sitting beside Visa and Mastercard. If they go,
the chips in `lib/site.ts` update in one line and the footer and cart drawer both follow
automatically.

---

## 6. What actually changes in this repository

Almost nothing — and that is by design. Payment methods live in WooCommerce, because
`/api/checkout` signs the cart and hands off to `shop.rovapeptides.com`. The gateway plugin,
Apple Pay enablement and ACH all get configured there.

Three frontend touchpoints:

**`lib/site.ts`** — the `paymentMethods` array drives the footer and the cart drawer. Update it
when the real stack is decided:

```ts
export const paymentMethods = [
  { label: "Visa", className: "bg-white/10 text-white font-bold italic tracking-tight" },
  { label: "Mastercard", className: "bg-white/10 text-white font-semibold" },
  { label: "Amex", className: "bg-white/10 text-white font-semibold" },
  { label: "Apple Pay", className: "bg-white/10 text-white font-semibold" },
  { label: "ACH", className: "bg-assay/20 text-assay font-semibold" },
];
```

**Apple Pay domain verification** — if the wallet button is ever to render on
`rovapeptides.com` rather than only on the WooCommerce checkout, Apple requires
`/.well-known/apple-developer-merchantid-domain-association` served from the apex domain. In
Next.js that is a file at `public/.well-known/apple-developer-merchantid-domain-association`
(no extension), served verbatim. The gateway issues the file contents.

**Express wallet on the PDP** — only worth building after a gateway is live. It would replace
the current form POST in `components/cart/CartDrawer.tsx` with the gateway's payment-request
button, and it changes the handoff architecture, so it is a phase-two conversation.

---

## Suggested order

1. Decide the acquiring relationship first — everything else is downstream of underwriting.
2. Price Path A (high-risk MID + NMI or Authorize.net) against Path C (2Checkout as MoR).
3. Add ACH regardless; it is the layer that survives card shutoffs.
4. Put the ePayVista questions in §4 to them in writing before considering it.
5. Correct the Cash App and Zelle presentation now — that is a one-line change and it is a
   truthfulness issue rather than a payments one.

**Sources:** [ePayVista](https://epayvista.com/) · observed checkout parameters at
`checkout.calibratedlabs.com` (August 2026)
