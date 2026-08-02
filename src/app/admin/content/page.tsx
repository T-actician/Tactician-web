"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { SiteContent } from "@/types/content";
import MediaUploader from "@/components/admin/MediaUploader";

export default function AdminContentPage() {
  const [content, setContent] = useState<SiteContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content")
      .then((r) => r.json())
      .then(setContent);
  }, []);

  if (!content) return <p className="text-slate-500">Loading...</p>;

  async function save() {
    setSaving(true);
    setSaved(false);
    await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col gap-10 pb-24">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ink-900">Site Content</h1>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
        </button>
      </div>

      {/* Hero */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-ink-900">Hero</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" value={content.hero.firstName} onChange={(v) => setContent({ ...content, hero: { ...content.hero, firstName: v } })} />
          <Field label="Last Name" value={content.hero.lastName} onChange={(v) => setContent({ ...content, hero: { ...content.hero, lastName: v } })} />
          <Field label="Role" value={content.hero.role} onChange={(v) => setContent({ ...content, hero: { ...content.hero, role: v } })} />
        </div>
        <Field
          label="Description"
          textarea
          value={content.hero.description}
          onChange={(v) => setContent({ ...content, hero: { ...content.hero, description: v } })}
        />

        <div className="mt-4 grid grid-cols-2 gap-6">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">Portrait Photo</p>
            {content.hero.portraitKey && (
              <div className="relative mb-2 h-40 w-32 overflow-hidden rounded-lg">
                <Image src={`/api/media/${content.hero.portraitKey}`} alt="" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              folder="hero"
              accept={{ "image/*": [] }}
              onUploaded={(r) => setContent({ ...content, hero: { ...content.hero, portraitKey: r.key } })}
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-semibold text-ink-900">Background Image</p>
            {content.hero.backgroundKey && (
              <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg">
                <Image src={`/api/media/${content.hero.backgroundKey}`} alt="" fill className="object-cover" />
              </div>
            )}
            <MediaUploader
              folder="hero"
              accept={{ "image/*": [] }}
              onUploaded={(r) => setContent({ ...content, hero: { ...content.hero, backgroundKey: r.key } })}
            />
          </div>
        </div>

      </section>

      {/* Socials */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-ink-900">Social Links</h2>
        <div className="grid grid-cols-2 gap-4">
          {content.socials.map((s, i) => (
            <Field
              key={s.platform}
              label={s.platform}
              value={s.url}
              onChange={(v) => {
                const socials = [...content.socials];
                socials[i] = { ...socials[i], url: v };
                setContent({ ...content, socials });
              }}
            />
          ))}
        </div>
      </section>

      {/* About */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-ink-900">About</h2>
        <Field label="Title" value={content.about.title} onChange={(v) => setContent({ ...content, about: { ...content.about, title: v } })} />
        <Field label="Description" textarea value={content.about.description} onChange={(v) => setContent({ ...content, about: { ...content.about, description: v } })} />
        <CommaField
          label="Tags"
          value={content.about.tags}
          onChange={(tags) => setContent({ ...content, about: { ...content.about, tags } })}
        />
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {content.about.stats.map((stat, i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg bg-slate-50 p-3">
              <input
                value={stat.label}
                onChange={(e) => {
                  const stats = [...content.about.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  setContent({ ...content, about: { ...content.about, stats } });
                }}
                className="rounded border border-slate-200 px-2 py-1 text-xs"
                placeholder="Label"
              />
              <input
                value={stat.value}
                onChange={(e) => {
                  const stats = [...content.about.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  setContent({ ...content, about: { ...content.about, stats } });
                }}
                className="rounded border border-slate-200 px-2 py-1 text-xs"
                placeholder="Value e.g. 10+"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Skills</h2>
          <button
            onClick={() => setContent({ ...content, skills: [...content.skills, { name: "New Skill", percent: 80 }] })}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {content.skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={skill.name}
                onChange={(e) => {
                  const skills = [...content.skills];
                  skills[i] = { ...skills[i], name: e.target.value };
                  setContent({ ...content, skills });
                }}
                className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={skill.percent}
                onChange={(e) => {
                  const skills = [...content.skills];
                  skills[i] = { ...skills[i], percent: Number(e.target.value) };
                  setContent({ ...content, skills });
                }}
                className="w-20 rounded border border-slate-200 px-3 py-2 text-sm"
              />
              <button onClick={() => setContent({ ...content, skills: content.skills.filter((_, x) => x !== i) })}>
                <Trash2 size={16} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Tools &amp; Technologies</h2>
          <button
            onClick={() => setContent({ ...content, tools: [...content.tools, { name: "New Tool", icon: "" }] })}
            className="flex items-center gap-1 text-sm font-semibold text-brand-600"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {content.tools.map((tool, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={tool.name}
                onChange={(e) => {
                  const tools = [...content.tools];
                  tools[i] = { ...tools[i], name: e.target.value };
                  setContent({ ...content, tools });
                }}
                className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm"
              />
              <button onClick={() => setContent({ ...content, tools: content.tools.filter((_, x) => x !== i) })}>
                <Trash2 size={14} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Experience</h2>
          <button
            onClick={() =>
              setContent({
                ...content,
                experience: [
                  ...content.experience,
                  {
                    id: crypto.randomUUID(),
                    role: "New Role",
                    company: "Company",
                    period: "2024 - Present",
                    description: "",
                    current: false,
                  },
                ],
              })
            }
            className="flex items-center gap-1 text-sm font-semibold text-brand-600"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {content.experience.map((exp, i) => (
            <div key={exp.id} className="rounded-xl bg-slate-50 p-4">
              <div className="mb-2 grid grid-cols-2 gap-3">
                <input
                  value={exp.role}
                  placeholder="Role"
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...experience[i], role: e.target.value };
                    setContent({ ...content, experience });
                  }}
                  className="rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={exp.company}
                  placeholder="Company"
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...experience[i], company: e.target.value };
                    setContent({ ...content, experience });
                  }}
                  className="rounded border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <div className="mb-2 flex items-center gap-3">
                <input
                  value={exp.period}
                  placeholder="Period e.g. 2022 - 2024"
                  onChange={(e) => {
                    const experience = [...content.experience];
                    experience[i] = { ...experience[i], period: e.target.value };
                    setContent({ ...content, experience });
                  }}
                  className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <label className="flex items-center gap-2 text-xs font-medium text-ink-900">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) => {
                      const experience = [...content.experience];
                      experience[i] = { ...experience[i], current: e.target.checked };
                      setContent({ ...content, experience });
                    }}
                  />
                  Current
                </label>
              </div>
              <textarea
                rows={2}
                value={exp.description}
                placeholder="Description"
                onChange={(e) => {
                  const experience = [...content.experience];
                  experience[i] = { ...experience[i], description: e.target.value };
                  setContent({ ...content, experience });
                }}
                className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-sm"
              />
              <button
                onClick={() => setContent({ ...content, experience: content.experience.filter((_, x) => x !== i) })}
                className="flex items-center gap-1 text-xs font-semibold text-red-500"
              >
                <Trash2 size={13} /> Remove
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">Testimonials</h2>
          <button
            onClick={() =>
              setContent({
                ...content,
                testimonials: [
                  ...content.testimonials,
                  { id: crypto.randomUUID(), name: "Name", role: "Role", company: "Company", quote: "" },
                ],
              })
            }
            className="flex items-center gap-1 text-sm font-semibold text-brand-600"
          >
            <Plus size={14} /> Add
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {content.testimonials.map((t, i) => (
            <div key={t.id} className="flex gap-4 rounded-xl bg-slate-50 p-4">
              <div className="w-24 shrink-0">
                {t.avatarKey && (
                  <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full">
                    <Image src={`/api/media/${t.avatarKey}`} alt="" fill className="object-cover" />
                  </div>
                )}
                <MediaUploader
                  folder="testimonials"
                  accept={{ "image/*": [] }}
                  label="Photo"
                  onUploaded={(r) => {
                    const testimonials = [...content.testimonials];
                    testimonials[i] = { ...testimonials[i], avatarKey: r.key };
                    setContent({ ...content, testimonials });
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="mb-2 grid grid-cols-3 gap-2">
                  <input
                    value={t.name}
                    placeholder="Name"
                    onChange={(e) => {
                      const testimonials = [...content.testimonials];
                      testimonials[i] = { ...testimonials[i], name: e.target.value };
                      setContent({ ...content, testimonials });
                    }}
                    className="rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    value={t.role}
                    placeholder="Role"
                    onChange={(e) => {
                      const testimonials = [...content.testimonials];
                      testimonials[i] = { ...testimonials[i], role: e.target.value };
                      setContent({ ...content, testimonials });
                    }}
                    className="rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    value={t.company}
                    placeholder="Company"
                    onChange={(e) => {
                      const testimonials = [...content.testimonials];
                      testimonials[i] = { ...testimonials[i], company: e.target.value };
                      setContent({ ...content, testimonials });
                    }}
                    className="rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <textarea
                  rows={2}
                  value={t.quote}
                  placeholder="Quote"
                  onChange={(e) => {
                    const testimonials = [...content.testimonials];
                    testimonials[i] = { ...testimonials[i], quote: e.target.value };
                    setContent({ ...content, testimonials });
                  }}
                  className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  onClick={() =>
                    setContent({ ...content, testimonials: content.testimonials.filter((_, x) => x !== i) })
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-red-500"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CV Content (used only for the auto-generated downloadable CV) */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-1 flex items-center justify-between">
          <h2 className="font-bold text-ink-900">CV Content</h2>
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
            Not shown on site — used to generate the downloadable CV
          </span>
        </div>
        <p className="mb-4 text-sm text-slate-500">
          The CV is generated automatically from your Experience, Skills, and Tools above, plus what you add here.
        </p>

        <Field
          label="Professional Summary (leave blank to reuse your About description)"
          textarea
          value={content.cv.summary}
          onChange={(v) => setContent({ ...content, cv: { ...content.cv, summary: v } })}
        />

        <CommaField
          label="Additional ATS Keywords (boosts keyword matching on job portals, not shown visually)"
          value={content.cv.keywords}
          onChange={(keywords) => setContent({ ...content, cv: { ...content.cv, keywords } })}
        />

        <div className="mt-4 grid grid-cols-2 gap-4">
          <CommaField
            label="Technical Skills — Engineering"
            value={content.cv.engineeringSkills}
            onChange={(engineeringSkills) => setContent({ ...content, cv: { ...content.cv, engineeringSkills } })}
          />
          <CommaField
            label="Technical Skills — Software & Tools"
            value={content.cv.softwareTools}
            onChange={(softwareTools) => setContent({ ...content, cv: { ...content.cv, softwareTools } })}
          />
          <CommaField
            label="Soft Skills"
            value={content.cv.softSkills}
            onChange={(softSkills) => setContent({ ...content, cv: { ...content.cv, softSkills } })}
          />
          <CommaField
            label="Languages (e.g. English – Proficient)"
            value={content.cv.languages}
            onChange={(languages) => setContent({ ...content, cv: { ...content.cv, languages } })}
          />
          <CommaField
            label="Interests"
            value={content.cv.interests}
            onChange={(interests) => setContent({ ...content, cv: { ...content.cv, interests } })}
          />
          <CommaField
            label="Strengths"
            value={content.cv.strengths}
            onChange={(strengths) => setContent({ ...content, cv: { ...content.cv, strengths } })}
          />
          <CommaField
            label="Values"
            value={content.cv.values}
            onChange={(values) => setContent({ ...content, cv: { ...content.cv, values } })}
          />
        </div>

        {/* Education */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Education</h3>
            <button
              onClick={() =>
                setContent({
                  ...content,
                  cv: {
                    ...content.cv,
                    education: [
                      ...content.cv.education,
                      { id: crypto.randomUUID(), degree: "Degree / Qualification", institution: "Institution", period: "2018 - 2022", description: "" },
                    ],
                  },
                })
              }
              className="flex items-center gap-1 text-sm font-semibold text-brand-600"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-4">
            {content.cv.education.map((edu, i) => (
              <div key={edu.id} className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2 grid grid-cols-2 gap-3">
                  <input
                    value={edu.degree}
                    placeholder="Degree / Qualification"
                    onChange={(e) => {
                      const education = [...content.cv.education];
                      education[i] = { ...education[i], degree: e.target.value };
                      setContent({ ...content, cv: { ...content.cv, education } });
                    }}
                    className="rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                  <input
                    value={edu.institution}
                    placeholder="Institution"
                    onChange={(e) => {
                      const education = [...content.cv.education];
                      education[i] = { ...education[i], institution: e.target.value };
                      setContent({ ...content, cv: { ...content.cv, education } });
                    }}
                    className="rounded border border-slate-200 px-3 py-2 text-sm"
                  />
                </div>
                <input
                  value={edu.period}
                  placeholder="Period e.g. 2018 - 2022"
                  onChange={(e) => {
                    const education = [...content.cv.education];
                    education[i] = { ...education[i], period: e.target.value };
                    setContent({ ...content, cv: { ...content.cv, education } });
                  }}
                  className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <textarea
                  rows={2}
                  value={edu.description}
                  placeholder="Notable coursework, honors, etc. (optional)"
                  onChange={(e) => {
                    const education = [...content.cv.education];
                    education[i] = { ...education[i], description: e.target.value };
                    setContent({ ...content, cv: { ...content.cv, education } });
                  }}
                  className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      cv: { ...content.cv, education: content.cv.education.filter((_, x) => x !== i) },
                    })
                  }
                  className="flex items-center gap-1 text-xs font-semibold text-red-500"
                >
                  <Trash2 size={13} /> Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-500">Certifications</h3>
            <button
              onClick={() =>
                setContent({
                  ...content,
                  cv: {
                    ...content.cv,
                    certifications: [
                      ...content.cv.certifications,
                      { id: crypto.randomUUID(), name: "Certification Name", issuer: "Issuing Body", year: "2024" },
                    ],
                  },
                })
              }
              className="flex items-center gap-1 text-sm font-semibold text-brand-600"
            >
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex flex-col gap-3">
            {content.cv.certifications.map((cert, i) => (
              <div key={cert.id} className="flex items-center gap-2 rounded-xl bg-slate-50 p-3">
                <input
                  value={cert.name}
                  placeholder="Certification Name"
                  onChange={(e) => {
                    const certifications = [...content.cv.certifications];
                    certifications[i] = { ...certifications[i], name: e.target.value };
                    setContent({ ...content, cv: { ...content.cv, certifications } });
                  }}
                  className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={cert.issuer}
                  placeholder="Issuer"
                  onChange={(e) => {
                    const certifications = [...content.cv.certifications];
                    certifications[i] = { ...certifications[i], issuer: e.target.value };
                    setContent({ ...content, cv: { ...content.cv, certifications } });
                  }}
                  className="flex-1 rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={cert.year}
                  placeholder="Year"
                  onChange={(e) => {
                    const certifications = [...content.cv.certifications];
                    certifications[i] = { ...certifications[i], year: e.target.value };
                    setContent({ ...content, cv: { ...content.cv, certifications } });
                  }}
                  className="w-20 rounded border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  onClick={() =>
                    setContent({
                      ...content,
                      cv: { ...content.cv, certifications: content.cv.certifications.filter((_, x) => x !== i) },
                    })
                  }
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <a
          href="/api/cv?preview=1"
          target="_blank"
          className="mt-6 inline-block rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Preview Generated CV
        </a>
      </section>

      {/* Contact */}
      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 font-bold text-ink-900">Contact Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Email" value={content.contact.email} onChange={(v) => setContent({ ...content, contact: { ...content.contact, email: v } })} />
          <Field label="Phone" value={content.contact.phone} onChange={(v) => setContent({ ...content, contact: { ...content.contact, phone: v } })} />
          <Field label="Location" value={content.contact.location} onChange={(v) => setContent({ ...content, contact: { ...content.contact, location: v } })} />
        </div>
      </section>
    </div>
  );
}

// For comma-separated list fields (skills, tags, keywords, etc). Keeps its
// own raw text while typing and only converts to a trimmed string[] on blur —
// splitting/trimming on every keystroke was eating the space bar, since a
// trailing space gets trimmed away the instant it's typed.
function CommaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (items: string[]) => void;
}) {
  const [text, setText] = useState(value.join(", "));

  useEffect(() => {
    setText(value.join(", "));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.join(",")]);

  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split(",").map((k) => k.trim()).filter(Boolean))}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="mb-3">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      )}
    </div>
  );
}
