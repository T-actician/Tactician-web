import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";
import { requireAdmin } from "@/lib/auth-guard";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
    const project = projects.find((p) => p.id === id);
    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(project);
  } catch (err: any) {
    console.error("GET /api/admin/projects/[id] failed:", err);
    return NextResponse.json({ error: err.message || "Failed to load project" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await req.json();
    const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return NextResponse.json({ error: "Not found" }, { status: 404 });

    projects[index] = {
      ...projects[index],
      ...body,
      id: projects[index].id,
      updatedAt: new Date().toISOString(),
    };

    await putJSON(PROJECTS_KEY, projects);
    return NextResponse.json(projects[index]);
  } catch (err: any) {
    console.error("PUT /api/admin/projects/[id] failed:", err);
    return NextResponse.json({ error: err.message || "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
    const filtered = projects.filter((p) => p.id !== id);
    await putJSON(PROJECTS_KEY, filtered);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("DELETE /api/admin/projects/[id] failed:", err);
    return NextResponse.json({ error: err.message || "Failed to delete project" }, { status: 500 });
  }
}
