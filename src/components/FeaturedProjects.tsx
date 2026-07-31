"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Project } from "@/types/content";

export default function FeaturedProjects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.featured).slice(0, 4);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-4">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Featured Projects</p>
        <Link href="/projects" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:underline">
          View All Projects <ArrowRight size={14} />
        </Link>
      </div>

      {featured.length === 0 ? (
        <div className="glass rounded-3xl p-10 text-center text-slate-500">
          No projects published yet. Add projects from the admin dashboard.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                href={`/projects/${project.slug}`}
                className="glass group block overflow-hidden rounded-2xl shadow-lg shadow-brand-900/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-40 w-full overflow-hidden">
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
                  <h4 className="font-bold text-ink-900">{project.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">{project.summary}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    View Project <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
