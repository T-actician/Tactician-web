import { NextRequest, NextResponse } from "next/server";
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

  const { error } = await admin.auth.admin.updateUserById(matchedUser.id, { password });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // Mark token used so it can't be replayed.
  const updatedTokens = tokens.map((t) => (t.token === token ? { ...t, used: true } : t));
  await putJSON(TOKENS_KEY, updatedTokens);

  return NextResponse.json({ success: true });
}
