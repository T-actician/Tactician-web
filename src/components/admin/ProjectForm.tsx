"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { Project, ProjectMediaItem } from "@/types/content";
import MediaUploader from "@/components/admin/MediaUploader";

const TEXT_FIELDS: { key: keyof Project; label: string; textarea?: boolean }[] = [
  { key: "title", label: "Title" },
  { key: "category", label: "Category" },
  { key: "summary", label: "Summary", textarea: true },
  { key: "problemStatement", label: "Problem Statement", textarea: true },
  { key: "objectives", label: "Objectives", textarea: true },
  { key: "designProcess", label: "Design Process", textarea: true },
  { key: "implementation", label: "Implementation", textarea: true },
  { key: "results", label: "Results", textarea: true },
  { key: "challenges", label: "Challenges Encountered", textarea: true },
  { key: "lessonsLearned", label: "Lessons Learned", textarea: true },
];

const emptyProject: Partial<Project> = {
  title: "",
  category: "",
  summary: "",
  technologies: [],
  coverImageKey: "",
  featured: false,
  status: "draft",
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
};

export default function ProjectForm({ initial, id }: { initial?: Project; id?: string }) {
  const router = useRouter();
  const [data, setData] = useState<Partial<Project>>(initial || emptyProject);
  const [techInput, setTechInput] = useState((initial?.technologies || []).join(", "));
  const [saving, setSaving] = useState(false);

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
      {TEXT_FIELDS.map((f) => (
        <div key={f.key as string}>
          <label className="mb-1 block text-sm font-semibold text-ink-900">{f.label}</label>
          {f.textarea ? (
            <textarea
              rows={4}
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
            <Image src={`/api/media/${data.coverImageKey}`} alt="" fill className="object-cover" />
          </div>
        )}
        <MediaUploader
          folder="projects/covers"
          accept={{ "image/*": [] }}
          onUploaded={(r) => update("coverImageKey", r.key as any)}
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-ink-900">Gallery Images</label>
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
          label="Add gallery image"
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
