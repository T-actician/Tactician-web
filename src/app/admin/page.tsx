export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-ink-900">Dashboard</h1>
      <p className="mt-1 text-slate-500">Manage your portfolio content and projects.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <a href="/admin/projects" className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
          <h2 className="font-bold text-ink-900">Projects</h2>
          <p className="mt-1 text-sm text-slate-500">Add, edit, publish, reorder, and delete projects.</p>
        </a>
        <a href="/admin/content" className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md">
          <h2 className="font-bold text-ink-900">Site Content</h2>
          <p className="mt-1 text-sm text-slate-500">Edit hero, about, skills, tools, and contact info.</p>
        </a>
      </div>
    </div>
  );
}
