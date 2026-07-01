"use client";

import { useState } from "react";

interface FileUploadMockProps {
  label: string;
  id: string;
  onChange?: (fileName: string) => void;
}

export default function FileUploadMock({ label, id, onChange }: FileUploadMockProps) {
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // PRODUCTION NOTE: Implement real file upload with virus scanning,
    // size limits, and secure storage (e.g., S3, Cloudinary)
    const file = e.target.files?.[0];
    if (file) {
      // DEMO ONLY: Store just the filename, not the actual file
      setFileName(file.name);
      onChange?.(file.name);
    }
  };

  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <label
          htmlFor={id}
          className="cursor-pointer px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
        >
          Choose File
        </label>
        <span className="text-xs text-slate-500">
          {fileName || "No file chosen"}
        </span>
      </div>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <p className="text-[10px] text-slate-400">
        Demo: file is not actually uploaded. Accepts image screenshots.
      </p>
    </div>
  );
}
