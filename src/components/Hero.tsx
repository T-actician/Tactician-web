"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Download, Mail, Phone, Zap, Target, Shield, Lightbulb } from "lucide-react";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { SiteContent } from "@/types/content";

const ICONS: Record<string, any> = { zap: Zap, target: Target, shield: Shield, lightbulb: Lightbulb };
const SOCIAL_ICONS: Record<string, any> = { linkedin: FaLinkedinIn, github: FaGithub, email: Mail, phone: Phone };

export default function Hero({ content }: { content: SiteContent }) {
  const { hero, traits, socials } = content;
  const portraitUrl = hero.portraitKey ? `/api/media/${hero.portraitKey}` : "";
  const bgUrl = hero.backgroundKey ? `/api/media/${hero.backgroundKey}` : "";

  return (
    <section id="home" className="relative overflow-hidden pt-14 pb-14">
      {/* Full-bleed background photo - kept vivid, only faded at the very bottom edge */}
      {bgUrl && (
        <div className="pointer-events-none absolute inset-0 -z-10">
          <Image src={bgUrl} alt="" fill priority className="object-cover" />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, transparent 62%, rgba(255,255,255,0.35) 76%, rgba(47,120,245,0.18) 87%, rgba(16,185,129,0.18) 95%, var(--background) 100%)",
            }}
          />
        </div>
      )}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 lg:grid-cols-[1.1fr_0.8fr_0.55fr] lg:items-center">
        {/* Left copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-2 text-lg font-semibold text-brand-600">{hero.greeting}</p>
          <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-6xl">
            {hero.firstName.toUpperCase()}{" "}
            <span className="text-gradient">{hero.lastName.toUpperCase()}</span>
          </h1>
          <h2 className="mt-2 text-2xl font-semibold text-slate-700 sm:text-3xl">
            Electrical &amp; <span className="text-brand-600">Electronics</span>{" "}
            <span className="text-accent-500">Engineer</span>
          </h2>
          <p className="mt-5 max-w-lg text-slate-800">{hero.description}</p>

          <div className="mt-7 flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-6 py-3 font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:-translate-y-0.5 hover:bg-brand-700 hover:shadow-xl"
            >
              View My Work <ArrowRight size={18} />
            </a>
            {hero.cvKey && (
              <a
                href={`/api/media/${hero.cvKey}`}
                className="glass inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-brand-700 shadow-sm transition hover:-translate-y-0.5"
              >
                Download CV <Download size={18} />
              </a>
            )}
          </div>

          <div className="mt-8 flex items-center gap-4">
            <span className="text-sm font-medium text-slate-700">Connect with me</span>
            {socials.map((s) => {
              const Icon = SOCIAL_ICONS[s.platform] ?? Mail;
              return (
                <a
                  key={s.platform}
                  href={s.url || "#"}
                  className="glass flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition hover:text-brand-600"
                >
                  <Icon size={14} />
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Portrait */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative mx-auto aspect-[3/4] w-full max-w-md lg:self-end lg:-mb-14"
        >
          <div className="absolute inset-0 scale-110 rounded-full bg-gradient-to-br from-brand-200/50 to-accent-400/30 blur-3xl" />
          {portraitUrl ? (
            <Image
              src={portraitUrl}
              alt="Portrait"
              fill
              priority
              sizes="(max-width: 768px) 90vw, 420px"
              className="relative object-contain object-bottom"
            />
          ) : (
            <div className="relative flex h-full items-center justify-center rounded-3xl border border-dashed border-brand-300 text-sm text-slate-400">
              Upload portrait in admin
            </div>
          )}
        </motion.div>

        {/* Trait cards */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col gap-3"
        >
          {traits.map((t) => {
            const Icon = ICONS[t.icon] ?? Zap;
            return (
              <div
                key={t.title}
                className="glass flex items-center gap-3 rounded-2xl border-l-4 border-brand-500 px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-600 shadow">
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink-900">{t.title}</p>
                  <p className="text-xs text-slate-500">{t.subtitle}</p>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
