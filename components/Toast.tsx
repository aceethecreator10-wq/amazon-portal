"use client";

import { useState, useEffect } from "react";
import { subscribe, removeToast, type Toast } from "@/lib/store";

export default function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsub = subscribe(setToasts);
    return unsub;
  }, []);

  if (toasts.length === 0) return null;

  const icons: Record<string, string> = {
    success: "bg-emerald-500",
    error: "bg-red-500",
    info: "bg-blue-500",
    warning: "bg-amber-500",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm ${icons[toast.type]} animate-in slide-in-from-right`}
        >
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="text-white/80 hover:text-white"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
