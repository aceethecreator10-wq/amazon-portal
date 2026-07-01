"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { fetchRefunds } from "@/lib/supabase/refunds";
import { formatDate } from "@/lib/utils";

export default function BuyerRefundsPage() {
  const [refunds, setRefunds] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchRefunds().then((res) => { setRefunds(res.refunds); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return refunds;
    const q = search.toLowerCase();
    return refunds.filter((r) => r.refund_id?.toLowerCase().includes(q) || r.tracking_id?.toLowerCase().includes(q) || r.reason?.toLowerCase().includes(q));
  }, [refunds, search]);

  const columns = [
    { key: "refund_id", header: "Refund ID", render: (r: any) => <span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span> },
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs">{r.tracking_id}</span> },
    { key: "reason", header: "Reason", className: "max-w-[200px]", render: (r: any) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
  ];

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6"><h1 className="text-xl font-bold text-slate-900">My Refunds</h1><p className="text-sm text-slate-500 mt-1">View all your refund requests</p></div>
        <div className="mb-4"><SearchFilterBar searchPlaceholder="Search by refund ID, tracking ID..." searchValue={search} onSearchChange={setSearch} /></div>
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r: any) => r.id} emptyMessage="No refund requests found."
          mobileCardHeader={(r: any) => <div className="flex items-center justify-between"><span className="font-mono text-xs font-medium text-amber-600">{r.refund_id}</span><StatusBadge status={r.status} /></div>}
          mobileCardFooter={(r: any) => <div className="text-xs text-slate-500 truncate">{r.reason}</div>} />
      </div>
    </AuthGuard>
  );
}
