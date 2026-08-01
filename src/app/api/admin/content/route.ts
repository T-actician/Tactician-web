import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { CONTENT_KEY, defaultContent, normalizeContent } from "@/lib/defaults";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const content = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));
    return NextResponse.json(content);
  } catch (err: any) {
    console.error("GET /api/admin/content failed:", err);
    return NextResponse.json({ error: err.message || "Failed to load content" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await putJSON(CONTENT_KEY, body);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/admin/content failed:", err);
    return NextResponse.json({ error: err.message || "Failed to save content" }, { status: 500 });
  }
}
