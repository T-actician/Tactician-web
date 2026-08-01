import { NextRequest, NextResponse } from "next/server";
import { getSignedPutUrl } from "@/lib/b2";
import { requireAdmin } from "@/lib/auth-guard";
import { randomUUID } from "crypto";

const ALLOWED = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
  "application/pdf": "pdf",
} as const;

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { folder, contentType } = await req.json();

    const ext = ALLOWED[contentType as keyof typeof ALLOWED];
    if (!ext) return NextResponse.json({ error: "Unsupported video type" }, { status: 400 });

    const key = `${folder || "uploads"}/${randomUUID()}.${ext}`;
    const uploadUrl = await getSignedPutUrl(key, contentType, 3600);
    const type = contentType === "application/pdf" ? "pdf" : "video";

    return NextResponse.json({ uploadUrl, key, type });
  } catch (err: any) {
    console.error("POST /api/admin/presign-upload failed:", err);
    return NextResponse.json({ error: err.message || "Failed to prepare upload" }, { status: 500 });
  }
}
