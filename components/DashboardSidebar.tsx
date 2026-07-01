"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { UserRole } from "@/lib/types";
import { logout } from "@/lib/auth";

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

const roleNav: Record<UserRole, NavItem[]> = {
  buyer: [
    { href: "/buyer/dashboard", label: "Dashboard", icon: "H" },
    { href: "/buyer/orders", label: "My Orders", icon: "O" },
    { href: "/buyer/refunds", label: "My Refunds", icon: "R" },
    { href: "/buyer/profile", label: "Profile", icon: "P" },
  ],
  mediator: [
    { href: "/mediator/dashboard", label: "Dashboard", icon: "H" },
    { href: "/mediator/orders", label: "Orders", icon: "O" },
    { href: "/mediator/refunds", label: "Refunds", icon: "R" },
    { href: "/mediator/profile", label: "Profile", icon: "P" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: "H" },
    { href: "/admin/orders", label: "Orders", icon: "O" },
    { href: "/admin/refunds", label: "Refunds", icon: "R" },
    { href: "/admin/deals", label: "Deals", icon: "D" },
    { href: "/admin/users", label: "Users", icon: "U" },
    { href: "/admin/settings", label: "Settings", icon: "S" },
  ],
};

export default function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname();
  const items = roleNav[role];

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 min-h-screen hidden lg:flex flex-col">
      <div className="p-4 border-b border-slate-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="text-base font-bold text-slate-900">
            DealFlow <span className="text-cyan-600">Portal</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              pathname === item.href
                ? "bg-blue-50 text-blue-700"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold">
              {item.icon}
            </span>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t border-slate-200">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
          <span className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center text-xs font-bold">H</span>
          Public Home
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
        >
          <span className="w-6 h-6 rounded-md bg-red-50 flex items-center justify-center text-xs font-bold">X</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
