"use client";

import { useState, useEffect, useMemo } from "react";
import MobileCardTable from "@/components/MobileCardTable";
import StatusBadge from "@/components/StatusBadge";
import SearchFilterBar from "@/components/SearchFilterBar";
import AuthGuard from "@/components/AuthGuard";
import { fetchOrders } from "@/lib/supabase/orders";
import { formatPrice, formatDate } from "@/lib/utils";

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      fetchOrders().then((res) => { setOrders(res.orders); setLoaded(true); });
    }
  }, [loaded]);

  const filtered = useMemo(() => {
    if (!search) return orders;
    const q = search.toLowerCase();
    return orders.filter((o) => o.tracking_id?.toLowerCase().includes(q) || o.platform?.toLowerCase().includes(q) || o.order_number?.toLowerCase().includes(q));
  }, [orders, search]);

  const columns = [
    { key: "tracking_id", header: "Tracking ID", render: (r: any) => <span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span> },
    { key: "platform", header: "Platform" },
    { key: "order_number", header: "Order ID", render: (r: any) => <span className="font-mono text-xs">{r.order_number}</span> },
    { key: "amount", header: "Amount", render: (r: any) => formatPrice(r.amount) },
    { key: "status", header: "Status", render: (r: any) => <StatusBadge status={r.status} /> },
    { key: "created_at", header: "Date", render: (r: any) => <span className="text-xs text-slate-500">{formatDate(r.created_at)}</span> },
  ];

  return (
    <AuthGuard role="buyer" fallback="/buyer/login">
      <div>
        <div className="mb-6"><h1 className="text-xl font-bold text-slate-900">My Orders</h1><p className="text-sm text-slate-500 mt-1">View all your submitted orders</p></div>
        <div className="mb-4"><SearchFilterBar searchPlaceholder="Search by tracking ID, platform..." searchValue={search} onSearchChange={setSearch} /></div>
        <MobileCardTable columns={columns} data={filtered} keyExtractor={(r: any) => r.id} emptyMessage="No orders found."
          mobileCardHeader={(r: any) => <div className="flex items-center justify-between"><span className="font-mono text-xs font-medium text-blue-600">{r.tracking_id}</span><StatusBadge status={r.status} /></div>}
          mobileCardFooter={(r: any) => <div className="flex items-center justify-between text-xs text-slate-500"><span>{r.platform} &middot; {formatPrice(r.amount)}</span><span>{formatDate(r.created_at)}</span></div>} />
      </div>
    </AuthGuard>
  );
}
