"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import StatCard from "@/components/StatCard";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import EmptyState from "@/components/EmptyState";
import AuthGuard from "@/components/AuthGuard";
import { getOrders, getRefundRequests } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Order, RefundRequest } from "@/lib/types";

export default function BuyerDashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const user = getCurrentUser();
      if (user) {
        const allOrders = getOrders().filter((o) => o.buyerId === user.id);
        const allRefunds = getRefundRequests().filter((r) => r.buyerId === user.id);
        setOrders(allOrders);
        setRefunds(allRefunds);
        setLoaded(true);
      }
    }
  }, [loaded]);

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter((o) => !["completed", "rejected"].includes(o.status)).length,
    refundPending: refunds.filter((r) => !["paid", "rejected"].includes(r.status)).length,
    refundCompleted: refunds.filter((r) => r.status === "paid").length,
  }), [orders, refunds]);

  const orderColumns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span> },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: Order) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  const refundColumns = [
    { key: "refundId", header: "Refund ID", render: (r: RefundRequest) => <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span> },
    { key: "reason", header: "Reason", className: "max-w-[200px]", render: (r: RefundRequest) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: RefundRequest) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: RefundRequest) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Buyer Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your orders and refunds</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total Orders" value={stats.total} color="blue" />
          <StatCard label="Active Orders" value={stats.active} color="cyan" />
          <StatCard label="Refunds Pending" value={stats.refundPending} color="amber" />
          <StatCard label="Completed Refunds" value={stats.refundCompleted} color="emerald" />
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <Link href="/order" className="flex-1 sm:flex-none text-center px-4 py-3 sm:py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors touch-target">
            Submit Order
          </Link>
          <Link href="/track" className="flex-1 sm:flex-none text-center px-4 py-3 sm:py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors touch-target">
            Track Order
          </Link>
          <Link href="/refund" className="flex-1 sm:flex-none text-center px-4 py-3 sm:py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 active:bg-slate-100 transition-colors touch-target">
            Request Refund
          </Link>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Recent Orders</h2>
            {orders.length > 0 ? (
              <MobileCardTable
                columns={orderColumns}
                data={orders.slice(0, 5)}
                keyExtractor={(r) => r.id}
                mobileCardHeader={(r) => (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>
                    <StatusBadge status={r.status} />
                  </div>
                )}
              />
            ) : (
              <EmptyState title="No orders yet" description="Submit your first order to get started." action={<Link href="/order" className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">Submit Order</Link>} />
            )}
          </div>

          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Recent Refund Requests</h2>
            {refunds.length > 0 ? (
              <MobileCardTable
                columns={refundColumns}
                data={refunds.slice(0, 5)}
                keyExtractor={(r) => r.id}
                mobileCardHeader={(r) => (
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span>
                    <StatusBadge status={r.status} />
                  </div>
                )}
              />
            ) : (
              <EmptyState title="No refund requests" description="You haven't submitted any refund requests yet." />
            )}
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
