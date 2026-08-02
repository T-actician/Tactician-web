"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch {
      setError("Something went wrong. Try again.");
      setStatus("error");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6">
      <div className="glass-dark w-full max-w-sm rounded-2xl p-8 text-white shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <Mail size={20} />
          </span>
          <h1 className="text-lg font-bold">Reset Password</h1>
        </div>

        {status === "sent" ? (
          <div className="text-center">
            <p className="rounded-lg bg-accent-500/20 px-3 py-3 text-sm text-accent-200">
              If that email is registered, a reset link has been sent. Check your inbox for further instructions.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <ArrowLeft size={14} /> Back to login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-sm text-white/60">
              Enter your admin email and we&apos;ll send you a link to reset your password.
            </p>

            {error && <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

            <label className="mb-1 block text-xs text-white/60">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-6 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold transition hover:bg-brand-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              href="/admin/login"
              className="mt-4 flex items-center justify-center gap-2 text-sm text-white/60 hover:text-white"
            >
              <ArrowLeft size={14} /> Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
