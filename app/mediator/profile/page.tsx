"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { User } from "@/lib/types";

export default function MediatorProfilePage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  if (!user) return null;

  return (
    <AuthGuard role="mediator" fallback="/mediator/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your account information</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-rose-600">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500 capitalize">{user.role}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Email</span>
              <span className="text-slate-900 font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">WhatsApp</span>
              <span className="text-slate-900 font-medium">{user.whatsapp}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Role</span>
              <span className="text-slate-900 font-medium capitalize">{user.role}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">Member Since</span>
              <span className="text-slate-900 font-medium">{formatDate(user.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
