"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done">("idle");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!ok) {
      setState("error");
      return;
    }
    setState("done");
  }

  if (state === "done") {
    return (
      <div className="flex items-center gap-2.5 rounded-full border border-signal/40 bg-brand-cta/10 px-4 py-3 text-sm text-white">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-cta text-white">
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </span>
        You&apos;re on the list — watch for new batch drops.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div
        className={[
          "flex items-center gap-2 rounded-full border bg-brand-deep/40 p-1.5 pl-4 transition-colors duration-160",
          state === "error" ? "border-gold" : "border-paper/20 focus-within:border-signal/60",
        ].join(" ")}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="you@lab.com"
          aria-label="Email address"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-white outline-none placeholder:text-white/40"
        />
        <button
          type="submit"
          aria-label="Subscribe"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-cta text-white transition-transform duration-160 ease-out-expo hover:shadow-lift active:scale-90"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2.2} />
        </button>
      </div>
      {state === "error" && (
        <p className="mt-2 pl-1 text-xs text-gold">Please enter a valid email address.</p>
      )}
    </form>
  );
}
