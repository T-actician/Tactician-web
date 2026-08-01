import { supabaseServer } from "@/lib/supabase-server";

export async function requireAdmin() {
  try {
    const supabase = await supabaseServer();
    const result = await Promise.race([
      supabase.auth.getUser(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Auth check timed out — Supabase project may be paused")), 8000)
      ),
    ]);
    return result.data.user;
  } catch (err) {
    console.error("requireAdmin failed:", err);
    return null;
  }
}
