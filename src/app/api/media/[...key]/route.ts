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
    const url = await getSignedGetUrl(fullKey, 604800); // 7 days (SigV4 max)
    const res = NextResponse.redirect(url);
    // Cache the redirect itself so repeat visits skip this server hop entirely
    res.headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    return res;
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
