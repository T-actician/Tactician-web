import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getJSON, putJSON } from "@/lib/b2";
import { supabaseAdmin } from "@/lib/supabase-admin";

const TOKENS_KEY = "content/password-reset-tokens.json";

interface ResetToken {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

export async function POST(req: NextRequest) {
  const { token, password } = await req.json();

  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing reset token" }, { status: 400 });
  }
  if (!password || typeof password !== "string" || password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const tokens = await getJSON<ResetToken[]>(TOKENS_KEY, []);
  const now = Date.now();
  const entry = tokens.find((t) => t.token === token);

  if (!entry || entry.used || entry.expiresAt < now) {
    return NextResponse.json({ error: "This reset link is invalid or has expired" }, { status: 400 });
  }

  const admin = supabaseAdmin();
  const { data: userList } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const matchedUser = userList?.users.find((u) => u.email?.toLowerCase() === entry.email);

  if (!matchedUser) {
    return NextResponse.json({ error: "Account no longer exists" }, { status: 400 });
  }

  // Reject if the new password is the same as the current one. We check this
  // by attempting a real sign-in with the candidate password on a throwaway
  // client — a successful login means it matches the current password.
  const probeClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
  const { data: probeResult } = await probeClient.auth.signInWithPassword({
    email: entry.email,
    password,
  });
  if (probeResult?.user) {
    await probeClient.auth.signOut();
    return NextResponse.json(
      { error: "New password must be different from your current password." },
      { status: 400 }
    );
  }

  const { error } = await admin.auth.admin.updateUserById(matchedUser.id, { password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Mark token used so it can't be replayed.
  const updatedTokens = tokens.map((t) => (t.token === token ? { ...t, used: true } : t));
  await putJSON(TOKENS_KEY, updatedTokens);

  return NextResponse.json({ success: true });
}
