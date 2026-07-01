"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import { signUp } from "@/lib/supabase/actions";
import { addToast } from "@/lib/store";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "", fullName: "", whatsapp: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password || !form.fullName) {
      setError("Full name, email and password are required");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const result = await signUp(form);
    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    addToast("success", "Account created! You can now sign in.");
    router.push("/login");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
          <p className="text-sm text-slate-500 mt-1">Register as a new buyer</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <FormInput label="Full Name" id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="John Doe" />
          <FormInput label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
          <FormInput label="WhatsApp (optional)" id="whatsapp" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="+91-9876543210" />
          <FormInput label="Password" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min 6 characters" />
          <button disabled={loading} type="submit" className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm">
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
