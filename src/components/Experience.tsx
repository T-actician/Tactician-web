"use client";

import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { ExperienceItem } from "@/types/content";

export default function Experience({ items }: { items: ExperienceItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-7xl px-6 py-14">
      <p className="mb-8 text-xs font-bold uppercase tracking-wider text-brand-600">Experience</p>

      <div className="relative flex flex-col gap-8 border-l-2 border-brand-100 pl-8">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="relative"
          >
            <span className="absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-white shadow-md">
              <Briefcase size={12} />
            </span>
            <div className="glass rounded-2xl p-5 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-ink-900">{item.role}</h3>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
                  {item.period}
                  {item.current && " · Present"}
                </span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-500">{item.company}</p>
              <p className="mt-2 text-sm text-slate-600">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
