import { NextResponse } from "next/server";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, defaultContent } from "@/lib/defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  const content = await getJSON(CONTENT_KEY, defaultContent);
  return NextResponse.json(content);
}
