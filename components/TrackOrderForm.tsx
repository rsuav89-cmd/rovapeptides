"use client";

import { useState } from "react";
import { PackageSearch } from "lucide-react";
import { WC_ACCOUNT_URL } from "@/lib/wc";

export function TrackOrderForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (orderId.trim()) params.set("order", orderId.trim());
    if (email.trim()) params.set("email", email.trim());
    const qs = params.toString();
    window.location.href = `${WC_ACCOUNT_URL}view-order/${encodeURIComponent(orderId.trim())}/${qs ? `?${qs}` : ""}`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-ink">Order number</span>
        <input
          required
          inputMode="numeric"
          autoComplete="off"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[rgba(255,255,255,0.42)] bg-paper-3 px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
          placeholder="e.g. 1042"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">Email used at checkout</span>
        <input
          required
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-[rgba(255,255,255,0.42)] bg-paper-3 px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
          placeholder="you@lab.edu"
        />
      </label>

      <button type="submit" className="btn-signal w-full">
        <PackageSearch className="h-4 w-4" strokeWidth={2.2} />
        Track Order
      </button>

      <p className="text-xs text-muted">
        You&apos;ll be redirected to your secure order page. Need help?{" "}
        <a href="/contact" className="underline">
          Contact support
        </a>
        .
      </p>
    </form>
  );
}
