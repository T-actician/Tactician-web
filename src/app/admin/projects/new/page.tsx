import ProjectForm from "@/components/admin/ProjectForm";

export const dynamic = "force-dynamic";

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink-900">New Project</h1>
      <ProjectForm />
    </div>
  );
}
