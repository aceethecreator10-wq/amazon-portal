"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import AuthGuard from "@/components/AuthGuard";
import { getUsers, getOrders, getRefundRequests, getDeals } from "@/lib/storage";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, RefundRequest, Deal, User } from "@/lib/types";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setUsers(getUsers());
      setOrders(getOrders());
      setRefunds(getRefundRequests());
      setDeals(getDeals());
      setLoaded(true);
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
    revenue: orders.filter((o) => o.status === "completed").reduce((s, o) => s + o.amount, 0),
  }), [users, orders, refunds, deals]);

  const orderColumns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span> },
    { key: "buyerName", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: Order) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  const refundColumns = [
    { key: "refundId", header: "Refund ID", render: (r: RefundRequest) => <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span> },
    { key: "trackingId", header: "Tracking", render: (r: RefundRequest) => <span className="font-mono text-xs">{r.trackingId}</span> },
    { key: "accountHolder", header: "Account Holder" },
    { key: "status", header: "Status", render: (r: RefundRequest) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: RefundRequest) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Full platform overview</p>
        </div>

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
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">All Orders</h2>
            <MobileCardTable
              columns={orderColumns}
              data={orders}
              keyExtractor={(r) => r.id}
              emptyMessage="No orders yet."
              mobileCardHeader={(r: Order) => (
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>
                  <StatusBadge status={r.status} />
                </div>
              )}
              mobileCardFooter={(r: Order) => (
                <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
              )}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">All Refund Requests</h2>
            <MobileCardTable
              columns={refundColumns}
              data={refunds}
              keyExtractor={(r) => r.id}
              emptyMessage="No refund requests yet."
              mobileCardHeader={(r: RefundRequest) => (
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span>
                  <StatusBadge status={r.status} />
                </div>
              )}
              mobileCardFooter={(r: RefundRequest) => (
                <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span>
              )}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
