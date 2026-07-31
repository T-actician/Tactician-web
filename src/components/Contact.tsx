"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { SiteContent } from "@/types/content";

export default function Contact({ content }: { content: SiteContent }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [startedAt] = useState(() => Date.now());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, formStartedAt: startedAt }),
    });
    if (res.ok) {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } else {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-7xl px-6 py-14">
      <div className="glass grid grid-cols-1 gap-8 rounded-3xl p-8 shadow-xl lg:grid-cols-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Contact</p>
          <h2 className="mt-2 text-2xl font-extrabold text-ink-900">Let&apos;s Work Together</h2>
          <p className="mt-3 text-slate-600">Have a project in mind? Send a message and I&apos;ll get back to you.</p>

          <div className="mt-6 flex flex-col gap-3 text-sm text-slate-600">
            {content.contact.email && (
              <p className="flex items-center gap-2"><Mail size={15} /> {content.contact.email}</p>
            )}
            {content.contact.phone && (
              <p className="flex items-center gap-2"><Phone size={15} /> {content.contact.phone}</p>
            )}
            {content.contact.location && (
              <p className="flex items-center gap-2"><MapPin size={15} /> {content.contact.location}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {/* Honeypot field - hidden from real users */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="absolute -left-[9999px]"
            onChange={(e) => setForm((f) => ({ ...f, company: e.target.value } as any))}
          />
          <input
            required
            placeholder="Your Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
          <input
            required
            type="email"
            placeholder="Your Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
          <textarea
            required
            rows={4}
            placeholder="Your Message"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500"
          />
          <button
            disabled={status === "sending"}
            className="flex items-center justify-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700"
          >
            {status === "sending" ? "Sending..." : <>Send Message <Send size={16} /></>}
          </button>
          {status === "sent" && <p className="text-sm text-accent-600">Message sent — thank you!</p>}
          {status === "error" && <p className="text-sm text-red-500">Something went wrong. Try again.</p>}
        </form>
      </div>
    </section>
  );
}
