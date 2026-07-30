"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { site } from "@/lib/site";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = `Name: ${name}
Email: ${email}

${message}`;
    const mailtoHref = `mailto:${site.contactEmail}?subject=${encodeURIComponent(
      subject || "Website inquiry"
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoHref;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="b_honeypot" style={{ display: "none" }} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-ink">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
            placeholder="Jane Researcher"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
            placeholder="jane@lab.edu"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm font-medium text-ink">Subject</span>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 w-full rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
          placeholder="Order question, COA lookup, bulk pricing…"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-ink">Message</span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full resize-none rounded-lg border border-line-strong bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-brand-cta"
          placeholder="How can we help?"
        />
      </label>

      <button type="submit" className="btn-signal">
        Send Message
        <Send className="h-4 w-4" strokeWidth={2.2} />
      </button>

      <p className="text-xs text-muted">
        Submitting opens your email client addressed to {site.contactEmail}. Prefer email directly?
        Reach us any time at{" "}
        <a href={`mailto:${site.contactEmail}`} className="underline">
          {site.contactEmail}
        </a>
        .
      </p>
    </form>
  );
}
