"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { Project } from "@/types/content";

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-slate-500">Loading...</p>;
  if (!project) return <p className="text-red-500">Project not found.</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">Edit Project</h1>
      <ProjectForm initial={project} id={id} />
    </div>
  );
}
