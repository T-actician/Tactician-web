"use client";

import { motion } from "framer-motion";
import { Briefcase, User, Smile, Clock } from "lucide-react";
import { SiteContent } from "@/types/content";
import AnimatedCounter from "./AnimatedCounter";

const ICONS: Record<string, any> = { briefcase: Briefcase, user: User, smile: Smile, clock: Clock };

export default function About({ content }: { content: SiteContent }) {
  const { about } = content;

  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="glass grid grid-cols-1 gap-8 rounded-3xl p-8 shadow-xl shadow-brand-900/5 lg:grid-cols-[1fr_1.3fr]"
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-brand-600">{about.eyebrow}</p>
          <h3 className="mt-2 text-3xl font-extrabold text-ink-900">{about.title}</h3>
          <p className="mt-4 text-slate-600">{about.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {about.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white px-4 py-1.5 text-xs font-semibold text-brand-700 shadow-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {about.stats.map((s) => {
            const Icon = ICONS[s.icon] ?? Briefcase;
            return (
              <div
                key={s.label}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/60 p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Icon size={18} />
                </span>
                <AnimatedCounter value={s.value} />
                <p className="text-xs font-medium text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
