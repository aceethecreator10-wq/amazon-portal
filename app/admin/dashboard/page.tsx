"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import AuthGuard from "@/components/AuthGuard";
import { fetchOrders } from "@/lib/supabase/orders";
import { fetchRefunds } from "@/lib/supabase/refunds";
import { fetchAllDeals } from "@/lib/supabase/deals";
import { fetchAllProfiles } from "@/lib/supabase/profiles";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [refunds, setRefunds] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      Promise.all([fetchAllProfiles(), fetchOrders(), fetchRefunds(), fetchAllDeals()]).then(([u, o, r, d]) => {
        setUsers(u.profiles);
        setOrders(o.orders);
        setRefunds(r.refunds);
        setDeals(d.deals);
        setLoaded(true);
      });
    }
  }, [loaded]);

  const stats = useMemo(() => ({
    buyers: users.filter((u) => u.role === "buyer").length,
    mediators: users.filter((u) => u.role === "mediator").length,
    totalDeals: deals.length,
    totalOrders: orders.length,
    totalRefunds: refunds.length,
    pendingRefunds: refunds.filter((r) => !["paid", "rejected"].includes(r.status)).length,
    completedRefunds: refunds.filter((r) => r.status === "paid").length,
    revenue: orders.filter((o) => o.status === "completed").reduce((s, o) => s + (o.amount || 0), 0),
  }), [users, orders, refunds, deals]);

  const orderColumns = [
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span> },
    { key: "buyer_name", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
  ];

  const refundColumns = [
    { key: "refund_id", header: "Refund ID", render: (r: any) => <span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span> },
    { key: "tracking_id", header: "Tracking", render: (r: any) => <span className="font-mono text-xs">{r.tracking_id}</span> },
    { key: "account_holder", header: "Account Holder" },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6"><h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1><p className="text-sm text-slate-500 mt-1">Full platform overview</p></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Buyers" value={stats.buyers} color="blue" />
          <StatCard label="Total Mediators" value={stats.mediators} color="rose" />
          <StatCard label="Total Deals" value={stats.totalDeals} color="cyan" />
          <StatCard label="Total Orders" value={stats.totalOrders} color="violet" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Refunds" value={stats.totalRefunds} color="amber" />
          <StatCard label="Pending Refunds" value={stats.pendingRefunds} color="rose" />
          <StatCard label="Completed Refunds" value={stats.completedRefunds} color="emerald" />
          <StatCard label="Volume (Completed)" value={formatPrice(stats.revenue)} color="blue" />
        </div>
        <div className="space-y-6">
          <div><h2 className="text-base font-semibold text-slate-900 mb-3">All Orders</h2>
            <MobileCardTable columns={orderColumns} data={orders} keyExtractor={(r: any) => r.id} emptyMessage="No orders yet."
              mobileCardHeader={(r: any) => <div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span><StatusBadge status={r.status} /></div>}
              mobileCardFooter={(r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>} /></div>
          <div><h2 className="text-base font-semibold text-slate-900 mb-3">All Refund Requests</h2>
            <MobileCardTable columns={refundColumns} data={refunds} keyExtractor={(r: any) => r.id} emptyMessage="No refund requests yet."
              mobileCardHeader={(r: any) => <div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span><StatusBadge status={r.status} /></div>}
              mobileCardFooter={(r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span>} /></div>
        </div>
      </div>
    </AuthGuard>
  );
}
