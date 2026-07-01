"use client";

import { useState } from "react";
import Link from "next/link";
import FormInput from "@/components/FormInput";
import { forgotPassword } from "@/lib/supabase/actions";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const result = await forgotPassword(email);
    if (result.error) {
      setError(result.error);
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Check your email</h1>
          <p className="text-sm text-slate-500 mb-6">If an account exists with that email, we&apos;ve sent a reset link.</p>
          <Link href="/login" className="text-blue-600 hover:underline text-sm font-medium">Back to Sign In</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2">Reset Password</h1>
        <p className="text-sm text-slate-500 text-center mb-6">Enter your email to receive a reset link</p>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}
          <FormInput label="Email" id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          <button type="submit" className="w-full px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors text-sm">Send Reset Link</button>
          <p className="text-center text-xs text-slate-500">
            <Link href="/login" className="text-blue-600 hover:underline font-medium">Back to Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
