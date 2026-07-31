"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2 } from "lucide-react";

export default function MediaUploader({
  folder,
  accept,
  onUploaded,
  label = "Upload file",
}: {
  folder: string;
  accept?: Record<string, string[]>;
  onUploaded: (result: { key: string; type: string }) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const onDrop = useCallback(
    async (files: File[]) => {
      const file = files[0];
      if (!file) return;
      setUploading(true);
      setError("");
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);
        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "Upload failed");
        }
        const data = await res.json();
        onUploaded(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setUploading(false);
      }
    },
    [folder, onUploaded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept, multiple: false });

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 text-center transition ${
        isDragActive ? "border-brand-500 bg-brand-50" : "border-slate-300 bg-slate-50"
      }`}
    >
      <input {...getInputProps()} />
      {uploading ? (
        <Loader2 className="animate-spin text-brand-600" size={20} />
      ) : (
        <UploadCloud className="text-slate-400" size={20} />
      )}
      <p className="text-sm text-slate-500">{uploading ? "Uploading..." : label}</p>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
