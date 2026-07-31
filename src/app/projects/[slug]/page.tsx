import { notFound } from "next/navigation";
import Image from "next/image";
import { FileText } from "lucide-react";
import { getJSON } from "@/lib/b2";
import { CONTENT_KEY, PROJECTS_KEY, defaultContent } from "@/lib/defaults";
import { Project, SiteContent } from "@/types/content";
import Navbar from "@/components/Navbar";
import Gallery from "@/components/Gallery";

export const dynamic = "force-dynamic";

const SECTIONS: { key: keyof Project; label: string }[] = [
  { key: "problemStatement", label: "Problem Statement" },
  { key: "objectives", label: "Objectives" },
  { key: "designProcess", label: "Design Process" },
  { key: "implementation", label: "Implementation" },
  { key: "results", label: "Results" },
  { key: "challenges", label: "Challenges Encountered" },
  { key: "lessonsLearned", label: "Lessons Learned" },
];

export default async function ProjectDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content: SiteContent = await getJSON(CONTENT_KEY, defaultContent);
  const projects = await getJSON<Project[]>(PROJECTS_KEY, []);
  const project = projects.find((p) => p.slug === slug && p.status === "published");

  if (!project) notFound();

  return (
    <main>
      <Navbar firstName={content.hero.firstName} lastName={content.hero.lastName} role={content.hero.role} />

      <section className="relative h-[40vh] w-full overflow-hidden">
        {project.coverImageKey && (
          <Image src={`/api/media/${project.coverImageKey}`} alt={project.title} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-ink-900/20" />
        <div className="absolute bottom-0 mx-auto w-full max-w-7xl px-6 pb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-brand-300">{project.category}</p>
          <h1 className="mt-1 text-3xl font-extrabold text-white sm:text-4xl">{project.title}</h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1fr_0.35fr]">
        <div className="flex flex-col gap-10">
          <p className="text-lg text-slate-600">{project.summary}</p>

          {SECTIONS.map(
            (s) =>
              project[s.key] && (
                <div key={s.key as string}>
                  <h2 className="text-xl font-bold text-ink-900">{s.label}</h2>
                  <p className="mt-2 whitespace-pre-line text-slate-600">{project[s.key] as string}</p>
                </div>
              )
          )}

          {project.gallery.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink-900">Gallery</h2>
              <Gallery items={project.gallery} />
            </div>
          )}

          {project.videos.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink-900">Videos</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {project.videos.map((v) => (
                  <video key={v.key} controls className="w-full rounded-xl shadow-md">
                    <source src={`/api/media/${v.key}`} />
                  </video>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="flex flex-col gap-6">
          <div className="glass rounded-2xl p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Technologies</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span key={t} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>

          {project.documents.length > 0 && (
            <div className="glass rounded-2xl p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Documents</p>
              <div className="mt-3 flex flex-col gap-2">
                {project.documents.map((d) => (
                  <a
                    key={d.key}
                    href={`/api/media/${d.key}`}
                    target="_blank"
                    className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm font-medium text-brand-700 shadow-sm hover:bg-white"
                  >
                    <FileText size={16} /> {d.caption || "Download PDF"}
                  </a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
