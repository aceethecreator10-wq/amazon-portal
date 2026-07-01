"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import { signIn } from "@/lib/supabase/actions";
import { addToast } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn({ email: form.email, password: form.password });
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    addToast("success", "Signed in!");
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Sign In</h1>
          <p className="text-sm text-slate-500 mt-1">Access your account</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <FormInput label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <FormInput label="Password" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" />
          <div className="text-right">
            <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
          </div>
          <button disabled={loading} type="submit" className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
          </p>
          <div className="p-3 bg-slate-50 rounded-lg space-y-1">
            <p className="text-xs text-slate-500 text-center font-medium">Demo Accounts</p>
            <p className="text-xs text-slate-400 text-center">buyer@demo.com / Demo@123</p>
            <p className="text-xs text-slate-400 text-center">mediator@demo.com / Demo@123</p>
            <p className="text-xs text-slate-400 text-center">admin@demo.com / Admin@123</p>
          </div>
        </form>
      </div>
    </div>
  );
}
