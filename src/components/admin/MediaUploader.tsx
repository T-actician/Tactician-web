"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Loader2 } from "lucide-react";

async function safeErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const data = await res.json();
      return data.error || `Upload failed (${res.status})`;
    } catch {
      return `Upload failed (${res.status})`;
    }
  }
  if (res.status === 413) return "File too large for direct upload.";
  return `Upload failed (${res.status})`;
}

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
        const isVideo = file.type.startsWith("video/");
        const isPdf = file.type === "application/pdf";
        const useDirectUpload = isVideo || isPdf;

        if (useDirectUpload) {
          // Videos and PDFs go straight to B2 via a presigned URL — bypasses
          // the server's request size limit, which is too small for large files.
          const presignRes = await fetch("/api/admin/presign-upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder, contentType: file.type }),
          });
          if (!presignRes.ok) {
            const msg = await safeErrorMessage(presignRes);
            throw new Error(msg);
          }
          const { uploadUrl, key, type } = await presignRes.json();

          const putRes = await fetch(uploadUrl, {
            method: "PUT",
            headers: { "Content-Type": file.type },
            body: file,
          });
          if (!putRes.ok) throw new Error("Video upload to storage failed");

          onUploaded({ key, type });
        } else {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("folder", folder);
          const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
          if (!res.ok) {
            const msg = await safeErrorMessage(res);
            throw new Error(msg);
          }
          const data = await res.json();
          onUploaded(data);
        }
      } catch (err: any) {
        setError(err.message || "Upload failed");
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
