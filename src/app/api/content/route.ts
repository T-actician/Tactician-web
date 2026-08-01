import { NextResponse } from "next/server";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, defaultContent, normalizeContent } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));
  return NextResponse.json(content);
}
