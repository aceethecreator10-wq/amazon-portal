"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { getRefundRequests } from "@/lib/storage";
import { getCurrentUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { RefundRequest } from "@/lib/types";

export default function BuyerRefundsPage() {
  const [refunds, setRefunds] = useState<RefundRequest[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      const user = getCurrentUser();
      if (user) {
        setRefunds(getRefundRequests().filter((r) => r.buyerId === user.id));
        setLoaded(true);
      }
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return refunds;
    const q = search.toLowerCase();
    return refunds.filter(
      (r) =>
        r.refundId.toLowerCase().includes(q) ||
        r.trackingId.toLowerCase().includes(q) ||
        r.reason.toLowerCase().includes(q)
    );
  }, [refunds, search]);

  const columns = [
    { key: "refundId", header: "Refund ID", render: (r: RefundRequest) => <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span> },
    { key: "trackingId", header: "Tracking ID", render: (r: RefundRequest) => <span className="font-mono text-xs">{r.trackingId}</span> },
    { key: "reason", header: "Reason", className: "max-w-[200px]", render: (r: RefundRequest) => <span className="text-xs truncate block">{r.reason}</span> },
    { key: "status", header: "Status", render: (r: RefundRequest) => <StatusBadge status={r.status} /> },
    { key: "createdAt", header: "Date", render: (r: RefundRequest) => <span className="text-xs text-slate-500">{formatDate(r.createdAt)}</span> },
  ];

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">My Refunds</h1>
          <p className="text-sm text-slate-500 mt-1">View all your refund requests</p>
        </div>
        <div className="mb-4">
          <SearchFilterBar searchPlaceholder="Search by refund ID, tracking ID..." searchValue={search} onSearchChange={setSearch} />
        </div>
        <MobileCardTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No refund requests found."
          mobileCardHeader={(r) => (
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-medium text-amber-600">{r.refundId}</span>
              <StatusBadge status={r.status} />
            </div>
          )}
          mobileCardFooter={(r) => (
            <div className="text-xs text-slate-500 truncate">{r.reason}</div>
          )}
        />
      </div>
    </AuthGuard>
  );
}
