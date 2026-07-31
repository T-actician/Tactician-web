import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { CONTENT_KEY, defaultContent } from "@/lib/defaults";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const content = await getJSON(CONTENT_KEY, defaultContent);
  return NextResponse.json(content);
}

export async function PUT(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  await putJSON(CONTENT_KEY, body);
  return NextResponse.json({ success: true });
}
