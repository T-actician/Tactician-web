"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { Testimonial } from "@/types/content";

export default function Testimonials({ items }: { items: Testimonial[] }) {
  if (items.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-mt-24 mx-auto max-w-7xl px-6 py-14">
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
            <div className="mt-4 flex items-center gap-3">
              {t.avatarKey && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                  <Image src={`/api/media/${t.avatarKey}`} alt={t.name} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-ink-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role} · {t.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
