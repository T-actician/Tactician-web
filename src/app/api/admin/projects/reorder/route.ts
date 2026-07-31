import { NextRequest, NextResponse } from "next/server";
import { getJSON, putJSON } from "@/lib/b2";
import { PROJECTS_KEY } from "@/lib/defaults";
import { Project } from "@/types/content";
import { requireAdmin } from "@/lib/auth-guard";

// body: { orderedIds: string[] }
export async function PUT(req: NextRequest) {
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
}
