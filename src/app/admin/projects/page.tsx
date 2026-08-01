"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, GripVertical, Trash2, Pencil, Eye, EyeOff } from "lucide-react";
import { Project } from "@/types/content";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/projects")
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({ error: `Request failed (${r.status})` }));
          throw new Error(data.error || `Request failed (${r.status})`);
        }
        return r.json();
      })
      .then((data) => {
        setProjects(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to load projects");
        setLoading(false);
      });
  }, []);

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const reordered = Array.from(projects);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setProjects(reordered);
    await fetch("/api/admin/projects/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderedIds: reordered.map((p) => p.id) }),
    });
  }

  async function toggleFeatured(p: Project) {
    const res = await fetch(`/api/admin/projects/${p.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !p.featured }),
    });
    const updated = await res.json();
    setProjects((prev) => prev.map((x) => (x.id === p.id ? updated : x)));
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project permanently?")) return;
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (error)
    return (
      <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600">
        {error}. If this mentions &quot;Unauthorized&quot; or times out, check that your Supabase project isn&apos;t paused, then refresh.
      </div>
    );

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Projects</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-brand-700"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
              {projects.map((p, index) => (
                <Draggable key={p.id} draggableId={p.id} index={index}>
                  {(dragProvided) => (
                    <div
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm"
                    >
                      <span {...dragProvided.dragHandleProps} className="cursor-grab text-slate-400">
                        <GripVertical size={18} />
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-ink-900">{p.title}</p>
                        <p className="text-xs text-slate-500">
                          {p.category} · {p.status === "published" ? "Published" : "Draft"}
                          {p.featured && " · Featured"}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFeatured(p)}
                        title={p.featured ? "Unfeature" : "Feature"}
                        className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                      >
                        {p.featured ? <Eye size={16} /> : <EyeOff size={16} />}
                      </button>
                      <Link href={`/admin/projects/${p.id}`} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => deleteProject(p.id)}
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
