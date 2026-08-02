"use client";

export const dynamic = "force-dynamic";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { KeyRound } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing or invalid. Request a new one.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setStatus("saving");
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Something went wrong. Try again.");
        setStatus("error");
        return;
      }
      setStatus("done");
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
            <KeyRound size={20} />
          </span>
          <h1 className="text-lg font-bold">Set New Password</h1>
        </div>

        {status === "done" ? (
          <div className="text-center">
            <p className="rounded-lg bg-accent-500/20 px-3 py-3 text-sm text-accent-200">
              Password reset successfully. Please go to the login page to sign in.
            </p>
            <Link
              href="/admin/login"
              className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

            <label className="mb-1 block text-xs text-white/60">New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <label className="mb-1 block text-xs text-white/60">Confirm New Password</label>
            <input
              type="password"
              required
              minLength={8}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mb-6 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />

            <button
              type="submit"
              disabled={status === "saving"}
              className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold transition hover:bg-brand-700 disabled:opacity-50"
            >
              {status === "saving" ? "Saving..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
