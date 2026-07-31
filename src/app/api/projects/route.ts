import { NextResponse } from "next/server";
import { getJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";

export const dynamic = "force-dynamic";

export async function GET() {
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const published = projects
    .filter((p) => p.status === "published")
    .sort((a, b) => a.order - b.order);
  return NextResponse.json(published);
}
