import Link from "next/link";
import Image from "next/image";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, PROJECTS_KEY, defaultContent } from "@/lib/defaults";
import { Project, SiteContent } from "@/types/content";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const content: SiteContent = await getJSON(CONTENT_KEY, defaultContent);
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const published = projects.filter((p) => p.status === "published").sort((a, b) => a.order - b.order);

  return (
    <main>
      <Navbar firstName={content.hero.firstName} lastName={content.hero.lastName} role={content.hero.role} />
      <section className="mx-auto max-w-7xl px-6 py-14">
        <h1 className="text-3xl font-extrabold text-ink-900">All Projects</h1>
        <p className="mt-2 text-slate-500">Engineering work across power systems, control, and automation.</p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {published.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              className="glass group block overflow-hidden rounded-2xl shadow-lg shadow-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-44 w-full overflow-hidden">
                {project.coverImageKey && (
                  <Image
                    src={`/api/media/${project.coverImageKey}`}
                    alt={project.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">{project.category}</p>
                <h3 className="mt-1 font-bold text-ink-900">{project.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
