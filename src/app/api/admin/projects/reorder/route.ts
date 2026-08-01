import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";
import { requireAdmin } from "@/lib/auth-guard";

// body: { orderedIds: string[] }
export async function PUT(req: NextRequest) {
  try {
    const user = await requireAdmin();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderedIds }: { orderedIds: string[] } = await req.json();
    const projects = await getJSON<Project[]>(PROJECTS_KEY, []);

    const updated = projects.map((p) => {
      const newOrder = orderedIds.indexOf(p.id);
      return newOrder === -1 ? p : { ...p, order: newOrder };
    });

    await putJSON(PROJECTS_KEY, updated);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("PUT /api/admin/projects/reorder failed:", err);
    return NextResponse.json({ error: err.message || "Failed to reorder projects" }, { status: 500 });
  }
}
