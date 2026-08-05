"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X, Plus, Trash2 } from "lucide-react";
import { Project, ProjectMediaItem, ProjectMetric, ChallengeSolution } from "@/types/content";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";

const SIMPLE_FIELDS: { key: keyof Project; label: string; textarea?: boolean }[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "summary", label: "Summary", textarea: true },
];

const RICH_FIELDS: { key: keyof Project; label: string }[] = [
  { key: "problemStatement", label: "Problem Statement / About the Project" },
  { key: "objectives", label: "Objectives" },
  { key: "designProcess", label: "Design Process" },
  { key: "implementation", label: "Implementation" },
  { key: "results", label: "Results" },
  { key: "challenges", label: "Challenges Encountered" },
  { key: "lessonsLearned", label: "Lessons Learned / What I Learned" },
];

const emptyProject: Partial<Project> = {
  title: "",
  category: "",
  summary: "",
  technologies: [],
  coverImageKey: "",
  coverImagePosition: "center",
  featured: false,
  status: "draft",
  projectType: "technical",
  problemStatement: "",
  objectives: "",
  designProcess: "",
  implementation: "",
  results: "",
  challenges: "",
  lessonsLearned: "",
  gallery: [],
  documents: [],
  videos: [],
  tagline: "",
  liveUrl: "",
  demoUrl: "",
  role: "",
  timeline: "",
  duration: "",
  teamSize: "",
  keyFeatures: [],
  techStackFrontend: [],
  techStackBackend: [],
  techStackDatabase: [],
  techStackTools: [],
  metrics: [],
  challengesSolutions: [],
};

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
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-ink-900">{label}</label>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => onChange(text.split(",").map((k) => k.trim()).filter(Boolean))}
        className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
      />
    </div>
  );
}

export default function ProjectForm({ initial, id }: { initial?: Project; id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<Partial<Project>>(initial || emptyProject);
  const [techInput, setTechInput] = useState((initial?.technologies || []).join(", "));
  const [saving, setSaving] = useState(false);

  const isSoftware = data.projectType === "software";

  function update<K extends keyof Project>(key: K, value: Project[K]) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  function addMedia(field: "gallery" | "documents" | "videos", item: { key: string; type: string }) {
    const media: ProjectMediaItem = { key: item.key, type: item.type as any };
    setData((prev) => ({ ...prev, [field]: [...((prev[field] as ProjectMediaItem[]) || []), media] }));
  }

  function removeMedia(field: "gallery" | "documents" | "videos", key: string) {
    setData((prev) => ({
      ...prev,
      [field]: ((prev[field] as ProjectMediaItem[]) || []).filter((m) => m.key !== key),
    }));
  }

  async function save(status: "draft" | "published") {
    setSaving(true);
    const payload = {
      ...data,
      status,
      technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
    };

    const res = await fetch(id ? `/api/admin/projects/${id}` : "/api/admin/projects", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) router.push("/admin/projects");
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">Project Type</label>
        <div className="flex gap-3">
          <button
            onClick={() => update("projectType", "technical")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !isSoftware ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Technical / Physical
          </button>
          <button
            onClick={() => update("projectType", "software")}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              isSoftware ? "bg-brand-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            Software / Web App
          </button>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Software projects get a case-study layout with a live demo link, tech stack, and results metrics.
        </p>
      </div>

      {SIMPLE_FIELDS.map((f) => (
        <div key={f.key as string}>
          <label className="mb-1 block text-sm font-semibold text-ink-900">{f.label}</label>
          {f.textarea ? (
            <textarea
              rows={3}
              value={(data[f.key] as string) || ""}
              onChange={(e) => update(f.key, e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          ) : (
            <input
              value={(data[f.key] as string) || ""}
              onChange={(e) => update(f.key, e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          )}
        </div>
      ))}

      {isSoftware && (
        <div className="flex flex-col gap-4 rounded-xl border border-brand-100 bg-brand-50/40 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-700">Software Project Details</p>

          <div>
            <label className="mb-1 block text-sm font-semibold text-ink-900">Tagline (short subtitle under title)</label>
            <input
              value={data.tagline || ""}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="e.g. Project Management SaaS Platform"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Live Site URL</label>
              <input
                value={data.liveUrl || ""}
                onChange={(e) => update("liveUrl", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Demo Video/Link URL</label>
              <input
                value={data.demoUrl || ""}
                onChange={(e) => update("demoUrl", e.target.value)}
                placeholder="https://..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Role</label>
              <input
                value={data.role || ""}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Full Stack Developer"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Timeline</label>
              <input
                value={data.timeline || ""}
                onChange={(e) => update("timeline", e.target.value)}
                placeholder="Jan 2024 - Apr 2024"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Duration</label>
              <input
                value={data.duration || ""}
                onChange={(e) => update("duration", e.target.value)}
                placeholder="4 Months"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-semibold text-ink-900">Team</label>
              <input
                value={data.teamSize || ""}
                onChange={(e) => update("teamSize", e.target.value)}
                placeholder="Solo Project"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <CommaField
            label="Key Features"
            value={data.keyFeatures || []}
            onChange={(v) => update("keyFeatures", v)}
          />

          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Tech Stack</p>
          <div className="grid grid-cols-2 gap-4">
            <CommaField
              label="Frontend"
              value={data.techStackFrontend || []}
              onChange={(v) => update("techStackFrontend", v)}
            />
            <CommaField
              label="Backend"
              value={data.techStackBackend || []}
              onChange={(v) => update("techStackBackend", v)}
            />
            <CommaField
              label="Database"
              value={data.techStackDatabase || []}
              onChange={(v) => update("techStackDatabase", v)}
            />
            <CommaField
              label="Tools & Services"
              value={data.techStackTools || []}
              onChange={(v) => update("techStackTools", v)}
            />
          </div>

          {/* Metrics */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Results &amp; Impact</p>
              <button
                onClick={() =>
                  update("metrics", [...(data.metrics || []), { label: "Metric", value: "0%" } as ProjectMetric])
                }
                className="flex items-center gap-1 text-sm font-semibold text-brand-600"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {(data.metrics || []).map((m, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-white p-2">
                  <input
                    value={m.value}
                    placeholder="60%"
                    onChange={(e) => {
                      const metrics = [...(data.metrics || [])];
                      metrics[i] = { ...metrics[i], value: e.target.value };
                      update("metrics", metrics);
                    }}
                    className="w-20 rounded border border-slate-200 px-2 py-1.5 text-sm"
                  />
                  <input
                    value={m.label}
                    placeholder="Reduction in delivery time"
                    onChange={(e) => {
                      const metrics = [...(data.metrics || [])];
                      metrics[i] = { ...metrics[i], label: e.target.value };
                      update("metrics", metrics);
                    }}
                    className="flex-1 rounded border border-slate-200 px-2 py-1.5 text-sm"
                  />
                  <button onClick={() => update("metrics", (data.metrics || []).filter((_, x) => x !== i))}>
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Challenges & Solutions */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Challenges &amp; Solutions</p>
              <button
                onClick={() =>
                  update("challengesSolutions", [
                    ...(data.challengesSolutions || []),
                    { challenge: "", solution: "" } as ChallengeSolution,
                  ])
                }
                className="flex items-center gap-1 text-sm font-semibold text-brand-600"
              >
                <Plus size={14} /> Add
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {(data.challengesSolutions || []).map((cs, i) => (
                <div key={i} className="grid grid-cols-2 gap-2 rounded-lg bg-white p-3">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Challenge</label>
                    <textarea
                      rows={2}
                      value={cs.challenge}
                      onChange={(e) => {
                        const list = [...(data.challengesSolutions || [])];
                        list[i] = { ...list[i], challenge: e.target.value };
                        update("challengesSolutions", list);
                      }}
                      className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-slate-500">Solution</label>
                    <textarea
                      rows={2}
                      value={cs.solution}
                      onChange={(e) => {
                        const list = [...(data.challengesSolutions || [])];
                        list[i] = { ...list[i], solution: e.target.value };
                        update("challengesSolutions", list);
                      }}
                      className="w-full rounded border border-slate-200 px-2 py-1.5 text-sm"
                    />
                  </div>
                  <button
                    onClick={() =>
                      update("challengesSolutions", (data.challengesSolutions || []).filter((_, x) => x !== i))
                    }
                    className="col-span-2 flex items-center gap-1 text-xs font-semibold text-red-500"
                  >
                    <Trash2 size={13} /> Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {RICH_FIELDS.map((f) => (
        <div key={f.key as string}>
          <label className="mb-1 block text-sm font-semibold text-ink-900">{f.label}</label>
          <RichTextEditor value={(data[f.key] as string) || ""} onChange={(html) => update(f.key, html as any)} />
        </div>
      ))}

      <div>
        <label className="mb-1 block text-sm font-semibold text-ink-900">Technologies (comma separated)</label>
        <input
          value={techInput}
          onChange={(e) => setTechInput(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">Cover Image</label>
        {data.coverImageKey && (
          <div className="relative mb-2 h-40 w-full overflow-hidden rounded-lg">
            <Image
              src={`/api/media/${data.coverImageKey}`}
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: data.coverImagePosition || "center" }}
            />
          </div>
        )}
        <MediaUploader
          folder="projects/covers"
          accept={{ "image/*": [] }}
          onUploaded={(r) => update("coverImageKey", r.key as any)}
        />

        {data.coverImageKey && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-semibold text-slate-500">
              Focal point — controls which part stays visible when the image is cropped
            </p>
            <div className="grid w-32 grid-cols-3 gap-1 rounded-lg bg-slate-100 p-1">
              {[
                "top left", "top", "top right",
                "left", "center", "right",
                "bottom left", "bottom", "bottom right",
              ].map((pos) => (
                <button
                  key={pos}
                  type="button"
                  title={pos}
                  onClick={() => update("coverImagePosition", pos as any)}
                  className={`aspect-square rounded transition ${
                    (data.coverImagePosition || "center") === pos
                      ? "bg-brand-600"
                      : "bg-white hover:bg-slate-200"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">
          {isSoftware ? "Screenshots" : "Gallery Images"}
        </label>
        <div className="mb-2 grid grid-cols-4 gap-2">
          {(data.gallery || []).map((m) => (
            <div key={m.key} className="relative h-20 overflow-hidden rounded-lg">
              <Image src={`/api/media/${m.key}`} alt="" fill className="object-cover" />
              <button
                onClick={() => removeMedia("gallery", m.key)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
        <MediaUploader
          folder="projects/gallery"
          accept={{ "image/*": [] }}
          onUploaded={(r) => addMedia("gallery", r)}
          label={isSoftware ? "Add screenshot" : "Add gallery image"}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">Documents (PDF)</label>
        <div className="mb-2 flex flex-col gap-1">
          {(data.documents || []).map((m) => (
            <div key={m.key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span>{m.key.split("/").pop()}</span>
              <button onClick={() => removeMedia("documents", m.key)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <MediaUploader
          folder="projects/documents"
          accept={{ "application/pdf": [] }}
          onUploaded={(r) => addMedia("documents", r)}
          label="Upload PDF"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">Videos</label>
        <div className="mb-2 flex flex-col gap-1">
          {(data.videos || []).map((m) => (
            <div key={m.key} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span>{m.key.split("/").pop()}</span>
              <button onClick={() => removeMedia("videos", m.key)}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <MediaUploader
          folder="projects/videos"
          accept={{ "video/mp4": [], "video/webm": [] }}
          onUploaded={(r) => addMedia("videos", r)}
          label="Upload video"
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium text-ink-900">
        <input
          type="checkbox"
          checked={!!data.featured}
          onChange={(e) => update("featured", e.target.checked as any)}
        />
        Featured on homepage
      </label>

      <div className="fixed bottom-0 left-60 right-0 flex justify-end gap-3 border-t bg-white p-4">
        <button
          disabled={saving}
          onClick={() => save("draft")}
          className="rounded-full border border-slate-300 px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Save Draft
        </button>
        <button
          disabled={saving}
          onClick={() => save("published")}
          className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>
    </div>
  );
}
