"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import { login } from "@/lib/auth";
import { addToast } from "@/lib/store";

export default function MediatorLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter email and password");
      return;
    }

    const user = login(form.email, form.password);
    if (!user) {
      setError("Invalid credentials. Try mediator@demo.com / demo123");
      return;
    }
    if (user.role !== "mediator") {
      setError("This login is for mediators only. Please use the correct portal.");
      return;
    }

    addToast("success", "Welcome back, " + user.name);
    router.push("/mediator/dashboard");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Mediator Login</h1>
          <p className="text-sm text-slate-500 mt-1">Sign in to your mediator dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>
          )}
          <FormInput label="Email" id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="mediator@demo.com" />
          <FormInput label="Password" id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="demo123" />
          <button type="submit" className="w-full px-6 py-2.5 bg-rose-600 text-white font-medium rounded-lg hover:bg-rose-700 transition-colors text-sm">
            Sign In
          </button>
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500 text-center">
              Demo Account: mediator@demo.com / demo123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
