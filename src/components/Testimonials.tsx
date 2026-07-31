"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Testimonial } from "@/types/content";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="mx-auto max-w-7xl px-6 py-14">
      <p className="mb-6 text-xs font-bold uppercase tracking-wider text-brand-600">Testimonials</p>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="glass rounded-2xl p-6 shadow-lg"
          >
            <Quote className="mb-3 text-brand-300" size={22} />
            <p className="text-sm text-slate-600">{t.quote}</p>
            <div className="mt-4">
              <p className="text-sm font-bold text-ink-900">{t.name}</p>
              <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
