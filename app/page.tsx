"use client";

import Link from "next/link";

const cards = [
  {
    title: "Live Deals",
    desc: "Browse active deals with cashback offers and exclusive discounts.",
    href: "/deals",
    color: "from-blue-600 to-blue-700",
    emoji: "D",
  },
  {
    title: "Submit Order",
    desc: "Place a new order through our streamlined submission form.",
    href: "/order",
    color: "from-emerald-500 to-emerald-600",
    emoji: "O",
  },
  {
    title: "Track Status",
    desc: "Monitor your order and refund status in real time.",
    href: "/track",
    color: "from-cyan-500 to-cyan-600",
    emoji: "T",
  },
  {
    title: "Refund Request",
    desc: "Initiate a refund request for eligible orders.",
    href: "/refund",
    color: "from-violet-500 to-violet-600",
    emoji: "R",
  },
  {
    title: "Buyer Login",
    desc: "Access your buyer dashboard to manage orders and refunds.",
    href: "/buyer/login",
    color: "from-amber-500 to-amber-600",
    emoji: "B",
  },
  {
    title: "Mediator Login",
    desc: "Mediator portal for reviewing and managing cases.",
    href: "/mediator/login",
    color: "from-rose-500 to-rose-600",
    emoji: "M",
  },
];

const steps = [
  { num: "1", title: "Pick a Deal", desc: "Browse live deals across Amazon, Flipkart, Myntra and more." },
  { num: "2", title: "Submit Order", desc: "Fill in your order details and submit for processing." },
  { num: "3", title: "Track Status", desc: "Monitor your order through every stage of the process." },
  { num: "4", title: "Request Refund", desc: "If eligible, submit a refund request and track its progress." },
];

const trustItems = [
  { title: "Secure Submissions", desc: "All submissions are processed through encrypted channels." },
  { title: "Role-Based Access", desc: "Buyers, mediators, and admins each have appropriate permissions." },
  { title: "Fast Status Tracking", desc: "Real-time updates on orders and refund requests." },
  { title: "Transparent Refund Flow", desc: "Clear refund policy with step-by-step tracking." },
];

export default function HomePage() {
  return (
    <>
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
              Manage Deals, Orders & Refunds in One Place
            </h1>
            <p className="mt-4 text-base sm:text-lg text-blue-200 leading-relaxed max-w-xl">
              DealFlow Portal streamlines deal management, order processing, and refund handling
              with role-based dashboards for buyers, mediators, and administrators.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/deals"
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold rounded-lg transition-colors text-sm"
              >
                View Live Deals
              </Link>
              <Link
                href="/order"
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-lg transition-colors text-sm border border-white/20"
              >
                Submit Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-0.5"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                >
                  {card.emoji}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900 text-sm">{card.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{card.desc}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="mt-2 text-sm text-slate-500">
              Simple four-step process to get started with DealFlow Portal
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-lg font-bold mx-auto mb-4">
                  {step.num}
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{step.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Trust & Security</h2>
            <p className="mt-2 text-sm text-slate-500">
              Built with security and transparency at its core
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustItems.map((item) => (
              <div key={item.title} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
