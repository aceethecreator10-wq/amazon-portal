"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

interface FileUploadProps {
  label: string;
  id: string;
  bucket: string;
  path: string;
  accept?: string;
  maxSizeMB?: number;
  onUploadComplete: (url: string) => void;
  onError?: (error: string) => void;
  existingUrl?: string;
}

export default function FileUpload({
  label,
  id,
  bucket,
  path,
  accept = "image/jpeg,image/png,image/webp,application/pdf",
  maxSizeMB = 5,
  onUploadComplete,
  onError,
  existingUrl,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingUrl || "");
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      onError?.(`File exceeds ${maxSizeMB}MB limit`);
      return;
    }

    const allowedTypes = accept.split(",");
    if (!allowedTypes.includes(file.type)) {
      onError?.(`Invalid file type. Accepted: ${accept}`);
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `${path}/${fileName}`;

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw new Error(error.message);

      const { data: urlData } = await supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      const publicUrl = urlData?.publicUrl || "";
      setPreview(publicUrl);
      onUploadComplete(publicUrl);
    } catch (err: any) {
      onError?.(err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">{label}</label>
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className={`cursor-pointer px-4 py-2 text-sm font-medium rounded-lg border transition-colors ${
            uploading
              ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          {uploading ? "Uploading..." : "Choose File"}
        </label>
        <span className="text-xs text-slate-500 truncate max-w-[200px]">
          {preview ? "File uploaded" : "No file chosen"}
        </span>
      </div>
      <input ref={inputRef} id={id} type="file" accept={accept} onChange={handleFile} className="hidden" disabled={uploading} />
      {progress > 0 && progress < 100 && (
        <div className="w-full h-1 bg-slate-200 rounded mt-1">
          <div className="h-full bg-blue-500 rounded transition-all" style={{ width: `${progress}%` }} />
        </div>
      )}
      {preview && (
        <div className="mt-2">
          <a href={preview} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            View uploaded file
          </a>
        </div>
      )}
      <p className="text-[10px] text-slate-400">Accepts {accept}. Max {maxSizeMB}MB.</p>
    </div>
  );
}
