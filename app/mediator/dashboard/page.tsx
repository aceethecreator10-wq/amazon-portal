"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import AuthGuard from "@/components/AuthGuard";
import { fetchOrders, updateOrderStatus } from "@/lib/supabase/orders";
import { fetchRefunds, updateRefundStatus } from "@/lib/supabase/refunds";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

export default function MediatorDashboardPage() {
  const [orders, setOrdersState] = useState<any[]>([]);
  const [refunds, setRefundsState] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      Promise.all([fetchOrders(), fetchRefunds()]).then(([o, r]) => {
        setOrdersState(o.orders);
        setRefundsState(r.refunds);
        setLoaded(true);
      });
    }
  }, [loaded]);

  const stats = useMemo(() => ({
    assigned: orders.filter((o) => o.assigned_mediator_id).length,
    pending: orders.filter((o) => o.status === "submitted" || o.status === "under_review").length,
    refundReview: refunds.filter((r) => r.status === "submitted" || r.status === "verification").length,
    completed: [...orders.filter((o) => o.status === "completed"), ...refunds.filter((r) => r.status === "paid")].length,
  }), [orders, refunds]);

  const handleOrderUpdate = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchOrders();
    setOrdersState(result.orders);
    addToast("success", `Order ${status.replace("_", " ")}`);
  };

  const handleRefundUpdate = async (id: string, status: string) => {
    const res = await updateRefundStatus(id, status);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchRefunds();
    setRefundsState(result.refunds);
    addToast("success", `Refund ${status.replace("_", " ")}`);
  };

  const actionButtons = (flow: string[], current: string, onUpdate: (s: string) => void) => {
    const idx = flow.indexOf(current);
    return (
      <div className="flex gap-1 flex-wrap">
        {idx < flow.length - 1 && (
          <button onClick={() => onUpdate(flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
            {flow[idx + 1].replace("_", " ")}
          </button>
        )}
        {current !== "rejected" && current !== "completed" && current !== "paid" && (
          <button onClick={() => onUpdate("rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
            Reject
          </button>
        )}
      </div>
    );
  };

  const orderFlow = ["submitted", "under_review", "approved", "rejected", "processing", "completed"];
  const refundFlow = ["submitted", "documents_received", "verification", "approved", "rejected", "paid"];

  const orderColumns = [
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span> },
    { key: "buyer_name", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => actionButtons(orderFlow, r.status, (s) => handleOrderUpdate(r.id, s)),
      mobileCardFooter: (r: any) => actionButtons(orderFlow, r.status, (s) => handleOrderUpdate(r.id, s)) },
  ];

  const refundColumns = [
    { key: "refund_id", header: "Refund ID", render: (r: any) => <span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span> },
    { key: "tracking_id", header: "Tracking", render: (r: any) => <span className="font-mono text-xs">{r.tracking_id}</span> },
    { key: "reason", header: "Reason", className: "max-w-[150px]", render: (r: any) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => actionButtons(refundFlow, r.status, (s) => handleRefundUpdate(r.id, s)),
      mobileCardFooter: (r: any) => actionButtons(refundFlow, r.status, (s) => handleRefundUpdate(r.id, s)) },
  ];

  return (
    <AuthGuard role="mediator" fallback="/mediator/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Mediator Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Manage assigned orders and refunds</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <StatCard label="Assigned Orders" value={stats.assigned} color="blue" />
          <StatCard label="Pending Review" value={stats.pending} color="amber" />
          <StatCard label="Refund Reviews" value={stats.refundReview} color="rose" />
          <StatCard label="Completed Cases" value={stats.completed} color="emerald" />
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Orders</h2>
            <MobileCardTable columns={orderColumns} data={orders} keyExtractor={(r: any) => r.id} emptyMessage="No orders assigned."
              mobileCardHeader={(r: any) => (<div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span><StatusBadge status={r.status} /></div>)} />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Refund Requests</h2>
            <MobileCardTable columns={refundColumns} data={refunds} keyExtractor={(r: any) => r.id} emptyMessage="No refund requests to review."
              mobileCardHeader={(r: any) => (<div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span><StatusBadge status={r.status} /></div>)} />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
