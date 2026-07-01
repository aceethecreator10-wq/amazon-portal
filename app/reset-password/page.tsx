"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import FormInput from "@/components/FormInput";
import { resetPassword } from "@/lib/supabase/actions";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError("Password must be at least 6 characters"); return; }
    setError("");
    const result = await resetPassword(password);
    if (result.error) { setError(result.error); return; }
    setDone(true);
    setTimeout(() => router.push("/login"), 2000);
  };

  if (done) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Password updated</h1>
          <p className="text-sm text-slate-500">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Set New Password</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Enter your new password</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <FormInput label="New Password" id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters" />
          <button type="submit" className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Update Password</button>
        </form>
      </div>
    </div>
  );
}
