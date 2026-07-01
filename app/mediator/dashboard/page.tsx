"use client";

import { useState, useEffect, useMemo } from "react";
import StatCard from "@/components/StatCard";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import AuthGuard from "@/components/AuthGuard";
import { getOrders, getRefundRequests, setOrders, setRefundRequests } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import type { Order, RefundRequest } from "@/lib/types";

const statusFlow: Record<string, string[]> = {
  order: ["submitted", "under_review", "approved", "rejected", "processing", "completed"],
  refund: ["submitted", "documents_received", "verification", "approved", "rejected", "paid"],
};

export default function MediatorDashboardPage() {
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [refunds, setRefundsState] = useState<RefundRequest[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const user = getCurrentUser();
      if (user) {
        setOrdersState(getOrders().filter((o) => o.assignedMediatorId === user.id || !o.assignedMediatorId));
        setRefundsState(getRefundRequests().filter((r) => r.assignedMediatorId === user.id || !r.assignedMediatorId));
        setLoaded(true);
      }
    }
  }, [loaded]);

  const stats = useMemo(() => ({
    assigned: orders.filter((o) => o.assignedMediatorId).length,
    pending: orders.filter((o) => o.status === "submitted" || o.status === "under_review").length,
    refundReview: refunds.filter((r) => r.status === "submitted" || r.status === "verification").length,
    completed: [...orders.filter((o) => o.status === "completed"), ...refunds.filter((r) => r.status === "paid")].length,
  }), [orders, refunds]);

  const updateOrderStatus = (id: string, status: string) => {
    const all = getOrders();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) return;
    const user = getCurrentUser();
    all[idx] = {
      ...all[idx],
      status: status as Order["status"],
      assignedMediatorId: user?.id || all[idx].assignedMediatorId,
      statusLogs: [
        ...all[idx].statusLogs,
        { id: `log-${Date.now()}`, status, note: "", changedBy: user?.name || "Mediator", createdAt: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    };
    setOrders(all);
    setOrdersState(getOrders().filter((o) => o.assignedMediatorId === user?.id || !o.assignedMediatorId));
    addToast("success", `Order ${status.replace("_", " ")}`);
  };

  const updateRefundStatus = (id: string, status: string) => {
    const all = getRefundRequests();
    const idx = all.findIndex((r) => r.id === id);
    if (idx === -1) return;
    const user = getCurrentUser();
    all[idx] = {
      ...all[idx],
      status: status as RefundRequest["status"],
      assignedMediatorId: user?.id || all[idx].assignedMediatorId,
      statusLogs: [
        ...all[idx].statusLogs,
        { id: `log-${Date.now()}`, status, note: "", changedBy: user?.name || "Mediator", createdAt: new Date().toISOString() },
      ],
      updatedAt: new Date().toISOString(),
    };
    setRefundRequests(all);
    setRefundsState(getRefundRequests().filter((r) => r.assignedMediatorId === user?.id || !r.assignedMediatorId));
    addToast("success", `Refund ${status.replace("_", " ")}`);
  };

  const orderColumns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span> },
    { key: "buyerName", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: Order) => {
        const flow = statusFlow.order;
        const idx = flow.indexOf(r.status);
        return (
          <div className="flex gap-1 flex-wrap">
            {idx < flow.length - 1 && (
              <button onClick={() => updateOrderStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
                {flow[idx + 1].replace("_", " ")}
              </button>
            )}
            {r.status !== "rejected" && r.status !== "completed" && (
              <button onClick={() => updateOrderStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
                Reject
              </button>
            )}
          </div>
        );
      },
    },
  ];

  const refundColumns = [
    { key: "refundId", header: "Refund ID", render: (r: RefundRequest) => <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span> },
    { key: "trackingId", header: "Tracking", render: (r: RefundRequest) => <span className="font-mono text-xs">{r.trackingId}</span> },
    { key: "reason", header: "Reason", className: "max-w-[150px]", render: (r: RefundRequest) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: RefundRequest) => <StatusBadge status={r.status} /> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: RefundRequest) => {
        const flow = statusFlow.refund;
        const idx = flow.indexOf(r.status);
        return (
          <div className="flex gap-1 flex-wrap">
            {idx < flow.length - 1 && (
              <button onClick={() => updateRefundStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
                {flow[idx + 1].replace("_", " ")}
              </button>
            )}
            {r.status !== "rejected" && r.status !== "paid" && (
              <button onClick={() => updateRefundStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
                Reject
              </button>
            )}
          </div>
        );
      },
    },
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
            <MobileCardTable
              columns={orderColumns}
              data={orders}
              keyExtractor={(r) => r.id}
              emptyMessage="No orders assigned."
              mobileCardHeader={(r: Order) => (
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>
                  <StatusBadge status={r.status} />
                </div>
              )}
              mobileCardFooter={(r: Order) => {
                const flow = statusFlow.order;
                const idx = flow.indexOf(r.status);
                return (
                  <div className="flex gap-1 flex-wrap">
                    {idx < flow.length - 1 && (
                      <button onClick={() => updateOrderStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
                        {flow[idx + 1].replace("_", " ")}
                      </button>
                    )}
                    {r.status !== "rejected" && r.status !== "completed" && (
                      <button onClick={() => updateOrderStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
                        Reject
                      </button>
                    )}
                  </div>
                );
              }}
            />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-900 mb-3">Refund Requests</h2>
            <MobileCardTable
              columns={refundColumns}
              data={refunds}
              keyExtractor={(r) => r.id}
              emptyMessage="No refund requests to review."
              mobileCardHeader={(r: RefundRequest) => (
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span>
                  <StatusBadge status={r.status} />
                </div>
              )}
              mobileCardFooter={(r: RefundRequest) => {
                const flow = statusFlow.refund;
                const idx = flow.indexOf(r.status);
                return (
                  <div className="flex gap-1 flex-wrap">
                    {idx < flow.length - 1 && (
                      <button onClick={() => updateRefundStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
                        {flow[idx + 1].replace("_", " ")}
                      </button>
                    )}
                    {r.status !== "rejected" && r.status !== "paid" && (
                      <button onClick={() => updateRefundStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
                        Reject
                      </button>
                    )}
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
