"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/deals", label: "Live Deals" },
  { href: "/order", label: "Submit Order" },
  { href: "/track", label: "Track" },
  { href: "/refund", label: "Refund" },
];

export default function PublicNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-slate-900">
              DealFlow <span className="text-cyan-600">Portal</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/buyer/login"
              className="text-sm font-medium px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Buyer Login
            </Link>
            <Link
              href="/mediator/login"
              className="text-sm font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Mediator Login
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-2">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/buyer/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg text-center"
            >
              Buyer Login
            </Link>
            <Link
              href="/mediator/login"
              onClick={() => setOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg text-center"
            >
              Mediator Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
