"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";
import DashboardSidebar from "./DashboardSidebar";
import MobileBottomNav from "./MobileBottomNav";
import StickyBottomCTA from "./StickyBottomCTA";
import ToastContainer from "./Toast";
import { seedDemoData } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import type { UserRole } from "@/lib/types";

const publicPaths = [
  "/", "/deals", "/order", "/track", "/refund", "/help",
  "/privacy", "/terms", "/refund-policy",
  "/buyer/login", "/buyer/register",
  "/mediator/login", "/admin/login",
];

const ctaPaths = ["/deals", "/order", "/track"];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [user, setUser] = useState<{ role: UserRole } | null>(null);

  useEffect(() => {
    seedDemoData();
    const u = getCurrentUser();
    setUser(u);
  }, [pathname]);

  const isPublic = publicPaths.includes(pathname);
  const isDashboard =
    (pathname.startsWith("/buyer/") && pathname !== "/buyer/login" && pathname !== "/buyer/register") ||
    (pathname.startsWith("/mediator/") && pathname !== "/mediator/login") ||
    (pathname.startsWith("/admin/") && pathname !== "/admin/login");

  const showCTA = ctaPaths.includes(pathname);

  if (pathname === "/mediator") {
    return <>{children}</>;
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

  if (isDashboard && user) {
    return (
      <div className="min-h-screen flex bg-slate-50">
        <DashboardSidebar role={user.role} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto pb-20 lg:pb-8">
            {children}
          </main>
        </div>
        <MobileBottomNav role={user.role} />
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
