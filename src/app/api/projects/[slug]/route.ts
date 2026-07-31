import { NextRequest, NextResponse } from "next/server";
import { getJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const project = projects.find((p) => p.slug === slug && p.status === "published");
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(project);
}
