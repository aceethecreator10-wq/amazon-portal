"use client";

import { useState, useEffect } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import AuthGuard from "@/components/AuthGuard";
import { formatPrice, formatDate } from "@/lib/utils";
import { addToast } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";

export default function AdminPayoutsPage() {
  const [payouts, setPayouts] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  const fetchPayouts = async () => {
    const supabase = createClient();
    const { data } = await (supabase.from("payouts") as any).select("*, refund_request:refund_request_id(refund_id, tracking_id)").order("created_at", { ascending: false });
    return data || [];
  };

  useEffect(() => {
    if (!loaded) {
      fetchPayouts().then(setPayouts);
      setLoaded(true);
    }
  }, [loaded]);

  const handleMarkPaid = async (id: string) => {
    const supabase = createClient();
    const { error } = await (supabase.from("payouts") as any).update({ status: "processed", processed_at: new Date().toISOString() }).eq("id", id);
    if (error) { addToast("error", error.message); return; }
    const { data: payout } = await (supabase.from("payouts") as any).select("refund_request_id").eq("id", id).single();
    if (payout?.refund_request_id) {
      await (supabase.from("refund_requests") as any).update({ status: "paid" }).eq("id", payout.refund_request_id);
    }
    fetchPayouts().then(setPayouts);
    addToast("success", "Payout marked as processed");
  };

  const columns = [
    { key: "payout_id", header: "Payout ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.payout_id}</span> },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "provider", header: "Provider", render: (r: any) => <span className="text-xs capitalize">{r.provider}</span> },
    { key: "refund_request_id", header: "Refund", render: (r: any) => <span className="font-mono text-xs">{r.refund_request?.refund_id || "-"}</span> },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
    { key: "actions", header: "Actions", hideOnMobile: true, render: (r: any) => (
      r.status === "manual_required" || r.status === "created" ? (
        <button onClick={() => handleMarkPaid(r.id)} className="px-2 py-1 text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100">Mark Paid</button>
      ) : null
    ), mobileCardFooter: (r: any) => (
      r.status === "manual_required" || r.status === "created" ? (
        <button onClick={() => handleMarkPaid(r.id)} className="px-2 py-1 text-[10px] font-medium bg-emerald-50 border border-emerald-200 text-emerald-700 rounded hover:bg-emerald-100">Mark Paid</button>
      ) : null
    )},
  ];

  return (
    <AuthGuard role="admin" fallback="/admin/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Payouts</h1>
          <p className="text-sm text-slate-500 mt-1">Manage refund payout disbursements</p>
        </div>
        <MobileCardTable columns={columns} data={payouts} keyExtractor={(r: any) => r.id} emptyMessage="No payouts yet."
          mobileCardHeader={(r: any) => (<div className="flex items-center justify-between w-full"><span className="font-mono text-xs font-medium text-blue-600">{r.payout_id}</span><StatusBadge status={r.status} /></div>)} />
      </div>
    </AuthGuard>
  );
}
