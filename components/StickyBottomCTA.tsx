"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const ctas: Record<string, { label: string; href: string }> = {
  "/deals": { label: "Submit Order", href: "/order" },
  "/order": { label: "Track Status", href: "/track" },
  "/track": { label: "View Live Deals", href: "/deals" },
};

export default function StickyBottomCTA() {
  const pathname = usePathname();
  const cta = ctas[pathname];
  if (!cta) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] safe-area-bottom">
      <div className="px-4 py-3">
        <Link
          href={cta.href}
          className="w-full block text-center px-6 py-3.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors text-[16px] touch-target"
        >
          {cta.label}
        </Link>
      </div>
    </div>
  );
}
