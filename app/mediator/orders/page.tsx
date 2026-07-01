"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { fetchOrders, updateOrderStatus } from "@/lib/supabase/orders";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

const flow = ["submitted", "under_review", "approved", "rejected", "processing", "completed"];

export default function MediatorOrdersPage() {
  const [orders, setOrdersState] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchOrders().then((res) => { setOrdersState(res.orders); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = orders;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((o) => o.tracking_id?.toLowerCase().includes(q) || o.buyer_name?.toLowerCase().includes(q) || o.platform?.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((o) => o.status === statusFilter);
    return result;
  }, [orders, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await updateOrderStatus(id, status);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchOrders();
    setOrdersState(result.orders);
    addToast("success", `Order ${status.replace("_", " ")}`);
  };

  const columns = [
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span> },
    { key: "buyer_name", header: "Buyer" },
    { key: "platform", header: "Platform" },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => {
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
      }, mobileCardFooter: (r: any) => {
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
          keyExtractor={(r: any) => r.id}
          emptyMessage="No orders to review."
          mobileCardHeader={(r: any) => (
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span>
              <StatusBadge status={r.status} />
            </div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
