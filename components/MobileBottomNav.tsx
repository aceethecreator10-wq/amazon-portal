"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem { href: string; label: string; icon: string; }

const roleNav: Record<string, NavItem[]> = {
  buyer: [
    { href: "/buyer/dashboard", label: "Home", icon: "H" },
    { href: "/buyer/orders", label: "Orders", icon: "O" },
    { href: "/buyer/refunds", label: "Refunds", icon: "R" },
    { href: "/buyer/profile", label: "Profile", icon: "P" },
  ],
  mediator: [
    { href: "/mediator/dashboard", label: "Home", icon: "H" },
    { href: "/mediator/orders", label: "Orders", icon: "O" },
    { href: "/mediator/refunds", label: "Refunds", icon: "R" },
    { href: "/mediator/profile", label: "Profile", icon: "P" },
  ],
  admin: [
    { href: "/admin/dashboard", label: "Home", icon: "H" },
    { href: "/admin/orders", label: "Orders", icon: "O" },
    { href: "/admin/refunds", label: "Refunds", icon: "R" },
    { href: "/admin/users", label: "Users", icon: "U" },
  ],
};

export default function MobileBottomNav({ role }: { role: string }) {
  const pathname = usePathname();
  const items = roleNav[role] || [];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg min-w-[60px] transition-colors ${
                isActive ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <span className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${
                isActive ? "bg-blue-50 text-blue-600" : "bg-transparent text-slate-400"
              }`}>{item.icon}</span>
              <span className={`text-[10px] font-medium ${isActive ? "text-blue-600" : "text-slate-500"}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
