import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, PROJECTS_KEY, defaultContent, normalizeContent } from "@/lib/defaults";
import { Project, SiteContent } from "@/types/content";
import CVDocument from "@/lib/CVDocument";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const content: SiteContent = normalizeContent(await getJSON(CONTENT_KEY, defaultContent));
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);

  const buffer = await renderToBuffer(<CVDocument content={content} projects={projects} />);

  const fileName = `${content.hero.firstName}-${content.hero.lastName}-CV.pdf`.replace(/\s+/g, "-");
  const isPreview = req.nextUrl.searchParams.get("preview") === "1";

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${isPreview ? "inline" : "attachment"}; filename="${fileName}"`,
      "Cache-Control": "no-store",
    },
  });
}
