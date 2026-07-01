"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface AuthGuardProps {
  children: React.ReactNode;
  role?: string;
  fallback?: string;
}

export default function AuthGuard({ children, role, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(fallback || "/login");
        return;
      }
      if (role) {
        const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", session.user.id).single();
        if (!profile || profile.role !== role) {
          router.push(fallback || "/login");
          return;
        }
      }
      setAuthorized(true);
      setLoading(false);
    };
    check();
  }, [router, role, fallback]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
