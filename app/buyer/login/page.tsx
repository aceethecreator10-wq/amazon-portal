"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import { signIn } from "@/lib/supabase/actions";
import { addToast } from "@/lib/store";

export default function BuyerLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) { setError("Email and password required"); return; }
    setLoading(true);
    const result = await signIn({ email: form.email, password: form.password });
    if (result.error) { setError(result.error); setLoading(false); return; }
    addToast("success", "Welcome buyer!");
    router.push("/buyer/dashboard");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Buyer Login</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your buyer dashboard</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <FormInput label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="buyer@demo.com" />
          <FormInput label="Password" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Demo@123" />
          <button disabled={loading} type="submit" className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/buyer/register" className="text-blue-600 hover:underline font-medium">Register</Link>
          </p>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">Demo: buyer@demo.com / Demo@123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
