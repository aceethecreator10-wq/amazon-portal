"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { getOrders, setOrders } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import type { Order } from "@/lib/types";

const flow = ["submitted", "under_review", "approved", "rejected", "processing", "completed"];

export default function MediatorOrdersPage() {
  const [orders, setOrdersState] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const user = getCurrentUser();
      if (user) {
        setOrdersState(getOrders().filter((o) => !o.assignedMediatorId || o.assignedMediatorId === user.id));
        setLoaded(true);
      }
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.trackingId.toLowerCase().includes(q) || o.buyerName.toLowerCase().includes(q) || o.platform.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    return result;
  }, [orders, search, statusFilter]);

  const updateStatus = (id: string, status: string) => {
    const all = getOrders();
    const idx = all.findIndex((o) => o.id === id);
    if (idx === -1) return;
    const user = getCurrentUser();
    all[idx] = {
      ...all[idx],
      status: status as Order["status"],
      assignedMediatorId: user?.id || all[idx].assignedMediatorId,
      statusLogs: [...all[idx].statusLogs, { id: `log-${Date.now()}`, status, note: "", changedBy: user?.name || "Mediator", createdAt: new Date().toISOString() }],
      updatedAt: new Date().toISOString(),
    };
    setOrders(all);
    setOrdersState(getOrders().filter((o) => !o.assignedMediatorId || o.assignedMediatorId === user?.id));
    addToast("success", `Order ${status.replace("_", " ")}`);
  };

  const columns = [
    { key: "trackingId", header: "Tracking ID", render: (r: Order) => <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span> },
    { key: "buyerName", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: Order) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: Order) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: Order) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: Order) => {
        const idx = flow.indexOf(r.status);
        return (
          <div className="flex gap-1 flex-wrap">
            {idx < flow.length - 1 && (
              <button onClick={() => updateStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
                {flow[idx + 1].replace("_", " ")}
              </button>
            )}
            {r.status !== "rejected" && r.status !== "completed" && (
              <button onClick={() => updateStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
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
          <h1 className="text-xl font-bold text-slate-900">Mediator Orders</h1>
          <p className="text-sm text-slate-500 mt-1">Review and update order statuses</p>
        </div>
        <div className="mb-4 space-y-3">
          <SearchFilterBar searchPlaceholder="Search orders..." searchValue={search} onSearchChange={setSearch} />
          <div className="flex gap-2 flex-wrap">
            {["all", "submitted", "under_review", "approved", "processing", "completed", "rejected"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <MobileCardTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No orders to review."
          mobileCardHeader={(r: Order) => (
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-xs font-medium text-blue-600">{r.trackingId}</span>
              <StatusBadge status={r.status} />
            </div>
          )}
          mobileCardFooter={(r: Order) => {
            const idx = flow.indexOf(r.status);
            return (
              <div className="flex gap-1 flex-wrap">
                {idx < flow.length - 1 && (
                  <button onClick={() => updateStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-blue-600 text-white rounded hover:bg-blue-700">
                    {flow[idx + 1].replace("_", " ")}
                  </button>
                )}
                {r.status !== "rejected" && r.status !== "completed" && (
                  <button onClick={() => updateStatus(r.id, "rejected")} className="px-2 py-1 text-[10px] font-medium bg-red-500 text-white rounded hover:bg-red-600">
                    Reject
                  </button>
                )}
              </div>
            );
          }}
        />
      </div>
    </AuthGuard>
  );
}
