import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";
import { requireAdmin } from "@/lib/auth-guard";
import { randomUUID } from "crypto";

export async function GET() {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
    return NextResponse.json(projects.sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
  } catch (err: any) {
    console.error("GET /api/admin/projects failed:", err);
    return NextResponse.json(
      { error: err.message || "Failed to load projects", stack: err.stack },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
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
      coverImagePosition: body.coverImagePosition || "center",
      featured: body.featured ?? false,
      order: projects.length,
      status: body.status || "draft",
      projectType: body.projectType === "software" ? "software" : "technical",
      includeInCV: body.includeInCV ?? false,
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
      tagline: body.tagline || "",
      liveUrl: body.liveUrl || "",
      demoUrl: body.demoUrl || "",
      role: body.role || "",
      timeline: body.timeline || "",
      duration: body.duration || "",
      teamSize: body.teamSize || "",
      keyFeatures: body.keyFeatures || [],
      techStackFrontend: body.techStackFrontend || [],
      techStackBackend: body.techStackBackend || [],
      techStackDatabase: body.techStackDatabase || [],
      techStackTools: body.techStackTools || [],
      metrics: body.metrics || [],
      challengesSolutions: body.challengesSolutions || [],
      createdAt: now,
      updatedAt: now,
    };

    projects.push(newProject);
    await putJSON(PROJECTS_KEY, projects);
    return NextResponse.json(newProject, { status: 201 });
  } catch (err: any) {
    console.error("POST /api/admin/projects failed:", err);
    return NextResponse.json({ error: err.message || "Failed to create project" }, { status: 500 });
  }
}
