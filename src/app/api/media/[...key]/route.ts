import { NextRequest, NextResponse } from "next/server";
import { getSignedGetUrl } from "@/lib/b2";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const fullKey = key.map(decodeURIComponent).join("/");

  if (!fullKey) return NextResponse.json({ error: "Missing key" }, { status: 400 });

  try {
    const url = await getSignedGetUrl(fullKey, 3600);
    return NextResponse.redirect(url);
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
