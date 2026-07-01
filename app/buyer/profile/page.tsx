"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import { getCurrentProfile } from "@/lib/supabase/profiles";
import { formatDate } from "@/lib/utils";

export default function BuyerProfilePage() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    getCurrentProfile().then(setProfile);
  }, []);

  if (!profile) return null;

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6"><h1 className="text-xl font-bold text-slate-900">Profile</h1><p className="text-sm text-slate-500 mt-1">Your account information</p></div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm max-w-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600">{profile.full_name?.charAt(0).toUpperCase()}</span>
            </div>
            <div><h2 className="text-lg font-semibold text-slate-900">{profile.full_name}</h2><p className="text-sm text-slate-500 capitalize">{profile.role}</p></div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Email</span><span className="text-slate-900 font-medium">{profile.email}</span></div>
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">WhatsApp</span><span className="text-slate-900 font-medium">{profile.whatsapp || "N/A"}</span></div>
            <div className="flex justify-between py-2 border-b border-slate-100"><span className="text-slate-500">Role</span><span className="text-slate-900 font-medium capitalize">{profile.role}</span></div>
            <div className="flex justify-between py-2"><span className="text-slate-500">Member Since</span><span className="text-slate-900 font-medium">{formatDate(profile.created_at)}</span></div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
