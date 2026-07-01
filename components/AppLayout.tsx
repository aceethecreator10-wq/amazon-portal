"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import DashboardSidebar from "./DashboardSidebar";
import MobileBottomNav from "./MobileBottomNav";
import StickyBottomCTA from "./StickyBottomCTA";
import ToastContainer from "./Toast";
import { createClient } from "@/lib/supabase/client";

const publicPaths = [
  "/", "/deals", "/order", "/track", "/refund", "/help",
  "/privacy", "/terms", "/refund-policy",
  "/login", "/register", "/forgot-password", "/reset-password",
  "/buyer/login", "/buyer/register",
  "/mediator/login", "/admin/login",
];

const ctaPaths = ["/deals", "/order", "/track"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await (supabase.from("profiles") as any).select("role").eq("id", session.user.id).single();
        if (profile) setUserRole(profile.role);
      }
      setLoading(false);
    };
    check();
  }, [pathname]);

  const isPublic = publicPaths.includes(pathname);
  const isDashboard =
    (pathname.startsWith("/buyer/") && pathname !== "/buyer/login" && pathname !== "/buyer/register") ||
    (pathname.startsWith("/mediator/") && pathname !== "/mediator/login") ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/login");

  const showCTA = ctaPaths.includes(pathname);

  if (loading) {
    return <div className="min-h-screen flex flex-col"><main className="flex-1">{children}</main></div>;
  }

  if (isPublic) {
    return (
      <div className="min-h-screen flex flex-col">
        <PublicNavbar />
        <main className="flex-1 pb-0">{children}</main>
        {showCTA && <StickyBottomCTA />}
        <Footer />
        <ToastContainer />
      </div>
    );
  }

  if (isDashboard && userRole) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        <DashboardSidebar role={userRole} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pb-20 lg:pb-8">{children}</main>
        </div>
        <MobileBottomNav role={userRole} />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <main className="flex-1">{children}</main>
      <ToastContainer />
    </div>
  );
}
