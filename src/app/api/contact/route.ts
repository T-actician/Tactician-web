import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";

const SUBMISSIONS_KEY = "content/contact-submissions.json";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, message, company, formStartedAt } = body;

  // Honeypot: bots fill hidden "company" field
  if (company) {
    return NextResponse.json({ success: true }); // silently drop
  }

  // Time-trap: reject submissions faster than 3 seconds
  if (formStartedAt && Date.now() - formStartedAt < 3000) {
    return NextResponse.json({ success: true });
  }

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const submissions = await getJSON<any[]>(SUBMISSIONS_KEY, []);
  submissions.push({
    id: crypto.randomUUID(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  });
  await putJSON(SUBMISSIONS_KEY, submissions);

  // Optional email notification via Resend, if configured
  if (process.env.RESEND_API_KEY && process.env.CONTACT_NOTIFY_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Portfolio Contact <onboarding@resend.dev>",
          to: process.env.CONTACT_NOTIFY_EMAIL,
          subject: `New portfolio message from ${name}`,
          text: `From: ${name} (${email})\n\n${message}`,
        }),
      });
    } catch {
      // Email failure shouldn't block the submission
    }
  }

  return NextResponse.json({ success: true });
}
