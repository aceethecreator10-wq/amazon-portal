"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { fetchRefunds, updateRefundStatus } from "@/lib/supabase/refunds";
import { formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";

const flow = ["submitted", "documents_received", "verification", "approved", "rejected", "paid"];

export default function MediatorRefundsPage() {
  const [refunds, setRefundsState] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchRefunds().then((res) => { setRefundsState(res.refunds); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    let result = refunds;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.refund_id?.toLowerCase().includes(q) || r.tracking_id?.toLowerCase().includes(q) || r.reason?.toLowerCase().includes(q));
    }
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [refunds, search, statusFilter]);

  const updateStatus = async (id: string, status: string) => {
    const res = await updateRefundStatus(id, status);
    if (res.error) { addToast("error", res.error); return; }
    const result = await fetchRefunds();
    setRefundsState(result.refunds);
    addToast("success", `Refund ${status.replace("_", " ")}`);
  };

  const columns = [
    { key: "refund_id", header: "Refund ID", render: (r: any) => <span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span> },
    { key: "tracking_id", header: "Tracking", render: (r: any) => <span className="font-mono text-xs">{r.tracking_id}</span> },
    { key: "reason", header: "Reason", className: "max-w-[150px]", render: (r: any) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    {
      key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => {
        const idx = flow.indexOf(r.status);
        return (
          <div className="flex gap-1 flex-wrap">
            {idx < flow.length - 1 && (
              <button onClick={() => updateStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
                {flow[idx + 1].replace("_", " ")}
              </button>
            )}
            {r.status !== "rejected" && r.status !== "paid" && (
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
              <button onClick={() => updateStatus(r.id, flow[idx + 1])} className="px-2 py-1 text-[10px] font-medium bg-amber-600 text-white rounded hover:bg-amber-700">
                {flow[idx + 1].replace("_", " ")}
              </button>
            )}
            {r.status !== "rejected" && r.status !== "paid" && (
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
          <h1 className="text-xl font-bold text-slate-900">Mediator Refunds</h1>
          <p className="text-sm text-slate-500 mt-1">Review and update refund request statuses</p>
        </div>
        <div className="mb-4 space-y-3">
          <SearchFilterBar searchPlaceholder="Search refunds..." searchValue={search} onSearchChange={setSearch} />
          <div className="flex gap-2 flex-wrap">
            {["all", "submitted", "documents_received", "verification", "approved", "paid", "rejected"].map((s) => (
              <button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${statusFilter === s ? "bg-amber-600 text-white border-amber-600" : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"}`}>
                {s === "all" ? "All" : s.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
        <MobileCardTable
          columns={columns}
          data={filtered}
          keyExtractor={(r: any) => r.id}
          emptyMessage="No refund requests to review."
          mobileCardHeader={(r: any) => (
            <div className="flex items-center justify-between w-full">
              <span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span>
              <StatusBadge status={r.status} />
            </div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
