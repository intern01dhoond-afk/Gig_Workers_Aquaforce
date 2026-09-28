"use client";

import { useState, FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle"
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/aquaforceforgigworkers/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 max-w-xs">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email"
        className="flex-1 bg-white/5 border border-white/15 rounded-md px-3 py-2 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-blue)]"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        aria-label="Subscribe"
        className="shrink-0 bg-[var(--color-blue)] text-white rounded-md p-2.5 hover:bg-[var(--color-blue-dark)] transition-colors disabled:opacity-60"
      >
        {status === "loading" ? (
          <Loader2 size={14} className="animate-spin" />
        ) : status === "done" ? (
          <Check size={14} />
        ) : (
          <ArrowRight size={14} />
        )}
      </button>
    </form>
  );
}
