import { NextRequest, NextResponse } from "next/server";
import { putObject } from "@/lib/b2";
import { requireAdmin } from "@/lib/auth-guard";
import { randomUUID } from "crypto";
import sharp from "sharp";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_IMAGE_BYTES = 25 * 1024 * 1024; // 25MB
const MAX_FILE_BYTES = 500 * 1024 * 1024; // 500MB (video/pdf)

const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_DOC = ["application/pdf"];
const ALLOWED_VIDEO = ["video/mp4", "video/webm", "video/quicktime"];

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const folder = (formData.get("folder") as string) || "misc";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const isImage = ALLOWED_IMAGE.includes(file.type);
  const isDoc = ALLOWED_DOC.includes(file.type);
  const isVideo = ALLOWED_VIDEO.includes(file.type);

  if (!isImage && !isDoc && !isVideo) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const sizeLimit = isImage ? MAX_IMAGE_BYTES : MAX_FILE_BYTES;
  if (buffer.length > sizeLimit) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }

  const id = randomUUID();

  if (isImage) {
    // Optimize: resize max width 1920, convert to webp, quality 82
    const optimized = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    const key = `${folder}/${id}.webp`;
    await putObject(key, optimized, "image/webp");
    return NextResponse.json({ key, type: "image" });
  }

  if (isDoc) {
    const ext = "pdf";
    const key = `${folder}/${id}.${ext}`;
    await putObject(key, buffer, file.type);
    return NextResponse.json({ key, type: "pdf" });
  }

  // video
  const ext = file.type === "video/webm" ? "webm" : "mp4";
  const key = `${folder}/${id}.${ext}`;
  await putObject(key, buffer, file.type);
  return NextResponse.json({ key, type: "video" });
}
