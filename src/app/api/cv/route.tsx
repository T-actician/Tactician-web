import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, defaultContent, normalizeContent } from "@/lib/defaults";
import { SiteContent } from "@/types/content";
import CVDocument from "@/lib/CVDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const content: SiteContent = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));

  const buffer = await renderToBuffer(<CVDocument content={content} />);

  const fileName = `${content.hero.firstName}-${content.hero.lastName}-CV.pdf`.replace(/\s+/g, "-");

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${fileName}"`,
      "Cache-Control": "public, max-age=300",
    },
  });
}
