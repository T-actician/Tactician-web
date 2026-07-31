"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";
import { Lock } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-6">
      <form onSubmit={handleSubmit} className="glass-dark w-full max-w-sm rounded-2xl p-8 text-white shadow-2xl">
        <div className="mb-6 flex flex-col items-center gap-2">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-600">
            <Lock size={20} />
          </span>
          <h1 className="text-lg font-bold">Admin Access</h1>
        </div>

        {error && <p className="mb-4 rounded-lg bg-red-500/20 px-3 py-2 text-sm text-red-200">{error}</p>}

        <label className="mb-1 block text-xs text-white/60">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />

        <label className="mb-1 block text-xs text-white/60">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm outline-none focus:border-brand-400"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold transition hover:bg-brand-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
