"use client";

import { motion } from "framer-motion";
import { SiteContent } from "@/types/content";

export default function SkillsSidebar({ content }: { content: SiteContent }) {
  const { skills, tools } = content;

  return (
    <aside id="skills" className="scroll-mt-24 glass flex flex-col gap-6 rounded-3xl p-6 shadow-xl shadow-brand-900/5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Core Skills</p>
        <div className="mt-4 flex flex-col gap-4">
          {skills.map((skill) => (
            <div key={skill.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-ink-900">{skill.name}</span>
                <span className="text-slate-500">{skill.percent}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-brand-100">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.percent}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-brand-600">Tools &amp; Technologies</p>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="flex flex-col items-center gap-1 rounded-xl bg-white/60 py-3 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-xs font-semibold text-ink-900">{tool.name}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
