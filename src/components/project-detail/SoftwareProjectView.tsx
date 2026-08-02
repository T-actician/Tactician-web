import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Play, ExternalLink, CheckCircle2, AlertTriangle, Check, MessageCircle, ArrowRight } from "lucide-react";
import { Project } from "@/types/content";
import Gallery from "@/components/Gallery";

function TechGroup({ title, items }: { title: string; items?: string[] }) {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((t) => (
          <span key={t} className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function SoftwareProjectView({ project }: { project: Project }) {
  const initial = project.title.trim()[0]?.toUpperCase() || "P";
  const hasTechStack =
    (project.techStackFrontend?.length || 0) +
      (project.techStackBackend?.length || 0) +
      (project.techStackDatabase?.length || 0) +
      (project.techStackTools?.length || 0) >
    0;

  return (
    <>
      {/* Dark hero */}
      <section className="bg-ink-900 pb-14 pt-8 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/projects" className="mb-8 inline-flex items-center gap-2 text-sm text-white/60 hover:text-white">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold">
                  {initial}
                </span>
                <h1 className="text-2xl font-extrabold sm:text-3xl">{project.title}</h1>
                {project.featured && (
                  <span className="rounded-full bg-brand-600/30 px-3 py-1 text-xs font-semibold text-brand-200">
                    Featured Project
                  </span>
                )}
              </div>

              {project.tagline && <p className="mt-2 text-lg text-white/70">{project.tagline}</p>}
              {project.summary && <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">{project.summary}</p>}

              <div className="mt-7 flex flex-wrap gap-3">
                {project.demoUrl && (
                  <a
                    href={project.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <Play size={15} /> Watch Demo
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    <ExternalLink size={15} /> Visit Live Site
                  </a>
                )}
              </div>

              {(project.role || project.timeline || project.duration || project.teamSize) && (
                <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/10 pt-6 sm:grid-cols-4">
                  {project.role && (
                    <div>
                      <p className="text-xs text-white/40">Role</p>
                      <p className="text-sm font-semibold">{project.role}</p>
                    </div>
                  )}
                  {project.timeline && (
                    <div>
                      <p className="text-xs text-white/40">Timeline</p>
                      <p className="text-sm font-semibold">{project.timeline}</p>
                    </div>
                  )}
                  {project.duration && (
                    <div>
                      <p className="text-xs text-white/40">Duration</p>
                      <p className="text-sm font-semibold">{project.duration}</p>
                    </div>
                  )}
                  {project.teamSize && (
                    <div>
                      <p className="text-xs text-white/40">Team</p>
                      <p className="text-sm font-semibold">{project.teamSize}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {project.coverImageKey && (
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <Image src={`/api/media/${project.coverImageKey}`} alt={project.title} fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Light content */}
      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {project.problemStatement && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink-900">About the Project</h2>
              <div
                className="prose prose-slate max-w-none text-slate-600"
                dangerouslySetInnerHTML={{ __html: project.problemStatement }}
              />
            </div>
          )}

          {project.gallery.length > 0 && (
            <div>
              <h2 className="mb-3 text-xl font-bold text-ink-900">Screenshots</h2>
              <Gallery items={project.gallery} />
            </div>
          )}
        </div>

        {project.keyFeatures && project.keyFeatures.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink-900">Key Features</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.keyFeatures.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-700">
                  <CheckCircle2 size={16} className="shrink-0 text-brand-600" /> {f}
                </div>
              ))}
            </div>
          </div>
        )}

        {hasTechStack && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink-900">Tech Stack</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <TechGroup title="Frontend" items={project.techStackFrontend} />
              <TechGroup title="Backend" items={project.techStackBackend} />
              <TechGroup title="Database" items={project.techStackDatabase} />
              <TechGroup title="Tools & Services" items={project.techStackTools} />
            </div>
          </div>
        )}

        {project.metrics && project.metrics.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink-900">Results &amp; Impact</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {project.metrics.map((m, i) => (
                <div key={i} className="glass rounded-2xl p-5 text-center shadow-sm">
                  <p className="text-2xl font-extrabold text-brand-600">{m.value}</p>
                  <p className="mt-1 text-xs text-slate-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.challengesSolutions && project.challengesSolutions.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-xl font-bold text-ink-900">Challenges &amp; Solutions</h2>
            <div className="flex flex-col gap-4">
              {project.challengesSolutions.map((cs, i) => (
                <div key={i} className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-5 sm:grid-cols-2">
                  <div className="flex gap-2">
                    <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Challenge</p>
                      <p className="text-sm text-slate-700">{cs.challenge}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent-600" />
                    <div>
                      <p className="text-xs font-semibold text-slate-500">Solution</p>
                      <p className="text-sm text-slate-700">{cs.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {project.lessonsLearned && (
          <div className="mt-12">
            <h2 className="mb-3 text-xl font-bold text-ink-900">What I Learned</h2>
            <div
              className="prose prose-slate max-w-none text-slate-600"
              dangerouslySetInnerHTML={{ __html: project.lessonsLearned }}
            />
          </div>
        )}

        <div className="mt-14 flex flex-col items-start justify-between gap-4 rounded-2xl bg-ink-900 p-8 text-white sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-2 text-lg font-bold">
              <MessageCircle size={18} /> Interested in working together?
            </p>
            <p className="mt-1 text-sm text-white/60">I&apos;m always open to discussing new opportunities and interesting projects.</p>
          </div>
          <Link
            href="/#contact"
            className="flex items-center gap-2 whitespace-nowrap rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Get In Touch <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </>
  );
}
