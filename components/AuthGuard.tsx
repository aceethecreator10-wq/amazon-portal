// PRODUCTION NOTE: This is a mock auth guard. Replace with proper middleware/route protection.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

interface AuthGuardProps {
  children: React.ReactNode;
  role?: UserRole;
  fallback?: string;
}

export default function AuthGuard({ children, role, fallback }: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.push(fallback || "/");
      return;
    }
    if (role && user.role !== role) {
      router.push(fallback || "/");
      return;
    }
    setAuthorized(true);
    setLoading(false);
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
