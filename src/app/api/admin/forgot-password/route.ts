import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { randomBytes } from "crypto";
import { getJSON, putJSON } from "@/lib/b2";
import { supabaseAdmin } from "@/lib/supabase-admin";

const TOKENS_KEY = "content/password-reset-tokens.json";
const TOKEN_TTL_MS = 30 * 60 * 1000; // 30 minutes
const COOLDOWN_MS = 60 * 1000; // 1 minute between requests per email

interface ResetToken {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
  used: boolean;
}

// Always respond with a generic success message, whether or not the email
// exists, so this endpoint can't be used to enumerate admin accounts.
const GENERIC_RESPONSE = NextResponse.json({
  success: true,
  message: "If that email is registered, a reset link has been sent.",
});

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const admin = supabaseAdmin();
  const { data: userList } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const matchedUser = userList?.users.find((u) => u.email?.toLowerCase() === normalizedEmail);

  // No matching admin account — don't reveal that, just return generic success.
  if (!matchedUser) {
    return GENERIC_RESPONSE;
  }

  const tokens = await getJSON<ResetToken[]>(TOKENS_KEY, []);
  const now = Date.now();

  // Cooldown: don't allow spamming reset requests for the same email.
  const recentForEmail = tokens.find(
    (t) => t.email === normalizedEmail && !t.used && now - t.createdAt < COOLDOWN_MS
  );
  if (recentForEmail) {
    return GENERIC_RESPONSE;
  }

  // Drop expired/used tokens to keep the store small.
  const activeTokens = tokens.filter((t) => !t.used && t.expiresAt > now);

  const token = randomBytes(32).toString("hex");
  activeTokens.push({
    token,
    email: normalizedEmail,
    createdAt: now,
    expiresAt: now + TOKEN_TTL_MS,
    used: false,
  });
  await putJSON(TOKENS_KEY, activeTokens);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;
  const resetLink = `${siteUrl}/admin/reset-password?token=${token}`;

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
      await transporter.sendMail({
        from: `Portfolio Admin <${process.env.GMAIL_USER}>`,
        to: normalizedEmail,
        subject: "Reset your admin password",
        text: `You requested a password reset.\n\nClick the link below to set a new password (expires in 30 minutes):\n${resetLink}\n\nIf you didn't request this, you can safely ignore this email.`,
      });
    } catch (err) {
      console.error("Failed to send password reset email:", err);
    }
  }

  return GENERIC_RESPONSE;
}
