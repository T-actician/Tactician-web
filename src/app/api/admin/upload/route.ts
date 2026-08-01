import { NextRequest, NextResponse } from "next/server";
import { putObject } from "@/lib/b2";
import { requireAdmin } from "@/lib/auth-guard";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

// Images only — videos and PDFs use the presigned direct-to-B2 upload flow
// (/api/admin/presign-upload) because Vercel serverless functions cap
// request bodies at ~4.5MB, which is too small for those file types.
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4MB, safely under Vercel's limit
const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "misc";

    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    if (!ALLOWED_IMAGE.includes(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.length > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image too large — please use a file under 4MB" },
        { status: 400 }
      );
    }

    // Optimize: resize max width 1920, convert to webp, quality 82
    const optimized = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const key = `${folder}/${randomUUID()}.webp`;
    await putObject(key, optimized, "image/webp");
    return NextResponse.json({ key, type: "image" });
  } catch (err: any) {
    console.error("POST /api/admin/upload failed:", err);
    return NextResponse.json({ error: err.message || "Upload failed" }, { status: 500 });
  }
}
