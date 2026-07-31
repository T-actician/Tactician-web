import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";
import { requireAdmin } from "@/lib/auth-guard";
import { randomUUID } from "crypto";

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  return NextResponse.json(projects.sort((a, b) => a.order - b.order));
}

export async function POST(req: NextRequest) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);

  const now = new Date().toISOString();
  const newProject: Project = {
    id: randomUUID(),
    slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || randomUUID(),
    title: body.title || "Untitled Project",
    category: body.category || "",
    summary: body.summary || "",
    technologies: body.technologies || [],
    coverImageKey: body.coverImageKey || "",
    featured: body.featured ?? false,
    order: projects.length,
    status: body.status || "draft",
    problemStatement: body.problemStatement || "",
    objectives: body.objectives || "",
    designProcess: body.designProcess || "",
    implementation: body.implementation || "",
    results: body.results || "",
    challenges: body.challenges || "",
    lessonsLearned: body.lessonsLearned || "",
    gallery: body.gallery || [],
    documents: body.documents || [],
    videos: body.videos || [],
    createdAt: now,
    updatedAt: now,
  };

  projects.push(newProject);
  await putJSON(PROJECTS_KEY, projects);
  return NextResponse.json(newProject, { status: 201 });
}
